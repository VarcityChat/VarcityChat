import { IMessageJob } from '@chat/interfaces/chat.interface';
import { BaseQueue } from './base.queue';
import { chatWorker } from '@root/shared/workers/chat.worker';

export enum ChatJobs {
  addChatMessageToDB = 'addChatMessageToDB'
}

class ChatQueue extends BaseQueue {
  constructor() {
    super('Chat');
    this.processJob(ChatJobs.addChatMessageToDB, 10, chatWorker.addChatMessageToDB);
  }

  public addChatJob(name: string, data: IMessageJob): void {
    this.addJob(name, data);
  }
}

export const chatQueue: ChatQueue = new ChatQueue();
