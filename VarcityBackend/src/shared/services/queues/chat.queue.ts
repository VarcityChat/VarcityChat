import { IConversationJob, IMessageJob } from '@chat/interfaces/chat.interface';
import { chatWorker, conversationWorker } from '@root/shared/workers/chat.worker';
import { BaseQueue } from './base.queue';

export enum ChatJobs {
  addChatMessageToDB = 'addChatMessageToDB'
}

export enum ConversationJobs {
  increaseUnreadCount = 'increaseUnreadCount'
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

class ConversationQueue extends BaseQueue {
  constructor() {
    super('Chat');
    this.processJob(
      ConversationJobs.increaseUnreadCount,
      10,
      conversationWorker.increaseUnreadMessageCount
    );
  }

  public addConversationJob(name: string, data: IConversationJob): void {
    this.addJob(name, data);
  }
}

export const chatQueue: ChatQueue = new ChatQueue();
export const conversationQueue: ConversationQueue = new ConversationQueue();
