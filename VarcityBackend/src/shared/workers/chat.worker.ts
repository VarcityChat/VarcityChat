import { DoneCallback, Job } from 'bull';
import { config } from '@root/config';
import { chatService } from '@service/db/chat.service';
import { ISenderReceiver } from '@chat/interfaces/chat.interface';
import Logger from 'bunyan';

const log: Logger = config.createLogger('chatWorker');

class ChatWorker {
  async addChatMessageToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      await chatService.addMessageToDB(value);
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
}

export const chatWorker: ChatWorker = new ChatWorker();
export const conversationWorker: ConversationWorker = new ConversationWorker();
