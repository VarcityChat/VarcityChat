import { DoneCallback, Job } from 'bull';
import { config } from '@root/config';
import { chatService } from '@service/db/chat.service';
import {
  IMessageData,
  ISenderReceiver,
  IUpdateConversation
} from '@chat/interfaces/chat.interface';
import Logger from 'bunyan';
import { notificationService } from '@service/db/notification.service';

const log: Logger = config.createLogger('chatWorker');

class ChatWorker {
  async addChatMessageToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      await chatService.addMessageToDB(value);
      await notificationService.sendChatMessageNotification(value as IMessageData);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}

class ConversationWorker {
  async increaseUnreadMessageCount(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      await chatService.increaseUnreadMessageCount(
        `${(value as ISenderReceiver).sender}`,
        `${(value as ISenderReceiver).receiver}`
      );
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }

  async updateConversationForNewMessage(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      await chatService.updateConversationForNewMessage(
        `${(value as IUpdateConversation).sender}`,
        `${(value as IUpdateConversation).receiver}`,
        (value as IUpdateConversation).lastMessageTimestamp,
        (value as IUpdateConversation).lastMessage
      );
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}

export const chatWorker: ChatWorker = new ChatWorker();
export const conversationWorker: ConversationWorker = new ConversationWorker();
