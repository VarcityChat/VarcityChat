import { BaseCache } from './base.cache';
import { config } from '@root/config';
import { ILeanConversation } from '@chat/interfaces/chat.interface';
import { chatService } from '@service/db/chat.service';
import Logger from 'bunyan';

const CACHE_NAME = 'ChatCache';
const log: Logger = config.createLogger(CACHE_NAME);

export class ChatCache extends BaseCache {
  constructor() {
    super(CACHE_NAME);
  }

  public async setUserOnline(userId: string): Promise<void> {
    try {
      const now = Date.now().toString();
      await this.client.hset(`user:${userId}`, 'status', 'online', 'lastSeen', now);
    } catch (error) {
      log.error(error);
    }
  }

  public async setUserOffline(userId: string): Promise<void> {
    try {
      const now = Date.now().toString();
      await this.client.hset(`user:${userId}`, 'status', 'offline', 'lastSeen', now);
    } catch (error) {
      log.error(error);
    }
  }

  public async getUserStatus(userId: string): Promise<{ status: string; lastSeen: string }> {
    try {
      const userData = await this.client.hgetall(`user:${userId}`);
      return {
        status: userData?.status || 'offline',
        lastSeen: userData?.lastSeen || ''
      };
    } catch (error) {
      log.error(error);
      return { status: 'offline', lastSeen: '' };
    }
  }

  public async addUserConversationPartner(
    userId: string,
    partner: ILeanConversation
  ): Promise<void> {
    try {
      await this.client.sadd(`user:${userId}:partners`, JSON.stringify(partner));
    } catch (error) {
      log.error(error);
    }
  }

  public async setUserConversationPartners(
    userId: string,
    partners: ILeanConversation[]
  ): Promise<void> {
    try {
      await this.client.sadd(
        `user:${userId}:partners`,
        ...partners.map((partner) => JSON.stringify(partner))
      );
    } catch (error) {
      log.error(error);
    }
  }

  public async getUserConversationPartners(userId: string): Promise<ILeanConversation[]> {
    try {
      const cachedPartners = await this.client.smembers(`user:${userId}:partners`);
      if (cachedPartners && cachedPartners.length > 0) {
        return cachedPartners.map((partner) => JSON.parse(partner) as ILeanConversation);
      }

      const conversationList = await chatService.getConversationList(userId);
      if (conversationList.length > 0) {
        const partners = conversationList.map((conversation) => {
          return {
            _id: conversation._id.toString(),
            user1: conversation.user1._id.toString(),
            user2: conversation.user2._id.toString(),
            status: conversation.status
          };
        });
        await this.setUserConversationPartners(userId, partners);
        return partners;
      }

      return [];
    } catch (error) {
      log.error(error);
      return [];
    }
  }

  public async updateUserActivity(userId: string): Promise<void> {
    try {
      await this.client.hset(`user:${userId}`, 'lastActive', Date.now().toString());
    } catch (error) {
      log.error(error);
    }
  }
}
