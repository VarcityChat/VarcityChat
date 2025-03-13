import { Server, Socket } from 'socket.io';
import { ChatHandler } from './chatHandler';
import { config } from '@root/config';
import { ChatCache } from '@service/redis/chat.cache';
import { AuthPayload } from '@auth/interfaces/auth.interface';
import JWT from 'jsonwebtoken';
import Logger from 'bunyan';

const log: Logger = config.createLogger('SocketIOUserHandler');

export let ioInstance: Server;

export interface UserSocket extends Socket {
  user?: AuthPayload;
}

export class SocketIOUserHandler {
  private io: Server;
  private chatCache: ChatCache;

  constructor(io: Server) {
    this.io = io;
    ioInstance = io;
    this.chatCache = new ChatCache();
  }

  public listen(): void {
    this.io.use(async (socket: UserSocket, next) => {
      const authToken =
        (socket.handshake.auth.authToken as string) ||
        (socket.handshake.headers.authorization as string);

      if (!authToken) {
        return next(new Error('No AuthToken provided'));
      }

      try {
        const user = JWT.verify(authToken, config.JWT_TOKEN!);
        socket.user = user as AuthPayload;
        next();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return next(new Error('Invalid AuthToken provided'));
      }
    });

    this.io.on('connection', async (socket: UserSocket) => {
      const user: AuthPayload = socket.user!;
      log.info('\nUser connected', user);
      this.io.emit('user-connected', user.userId);

      // Set user as online
      if (user.userId) {
        await this.chatCache.setUserOnline(user.userId);
        this.sendStatusToConversationPartners(user.userId, 'online');

        // The user joins the room with their userId
        socket.join(user.userId);

        // Pass the socket to the ChatHandler
        new ChatHandler(socket).handle();

        socket.on('get-user-activity', async (userId: string) => {
          const userStatus = await this.chatCache.getUserStatus(userId);
          socket.emit('user-status-changed', { userId, ...userStatus });
        });

        socket.on('disconnect', async () => {
          this.io.emit('user-disconnected', user.userId);
          console.log('user disconnected');
          await this.chatCache.setUserOffline(user.userId);
          await this.sendStatusToConversationPartners(user.userId, 'offline');
        });
      }
    });
  }

  private async sendStatusToConversationPartners(userId: string, status: 'online' | 'offline') {
    const partners = await this.chatCache.getUserConversationPartners(userId);
    partners.forEach((partner) => {
      let partnerId: string;
      if (partner.user1 === userId) {
        partnerId = partner.user2;
      } else {
        partnerId = partner.user1;
      }
      this.io.to(partnerId).emit('user-status-changed', {
        userId: partnerId,
        status,
        lastSeen: Date.now().toString()
      });
    });
  }
}
