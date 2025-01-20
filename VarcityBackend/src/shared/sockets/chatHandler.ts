/* eslint-disable @typescript-eslint/no-unused-vars */
import { IMessageData } from '@chat/interfaces/message.interface';
import { UserSocket } from './user';

export class ChatHandler {
  private socket: UserSocket;

  constructor(socket: UserSocket) {
    this.socket = socket;
  }

  handle(): void {
    this.socket.on('new-message', (message: IMessageData) => {
      console.log('\nMESSAGE:', message.sender);
      this.socket.to(`${message.receiver}`).emit('new-message', message);
    });

    this.socket.on('typing', (data) => {});

    this.socket.on('message-read', (data) => {});
  }
}
