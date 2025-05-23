import { IConversationJob, IMessageJob } from '@chat/interfaces/chat.interface';
import { chatWorker, conversationWorker } from '@root/shared/workers/chat.worker';
import { BaseQueue } from './base.queue';

export enum ChatJobs {
  addChatMessageToDB = 'addChatMessageToDB'
}

export enum ConversationJobs {
  increaseUnreadCount = 'increaseUnreadCount',
  updateConversationForNewMessage = 'updateConversationForNewMessage'
}

class ChatQueue extends BaseQueue {
  constructor() {
    super('ChatMessages');
    this.processJob(
      ChatJobs.addChatMessageToDB,
      10,
      chatWorker.addChatMessageToDB.bind(chatWorker)
    );
  }

  public addChatJob(name: string, data: IMessageJob): void {
    this.addJob(name, data);
  }
}

class ConversationQueue extends BaseQueue {
  constructor() {
    super('Conversations');
    this.processJob(
      ConversationJobs.increaseUnreadCount,
      10,
      conversationWorker.increaseUnreadMessageCount
    );
    this.processJob(
      ConversationJobs.updateConversationForNewMessage,
      10,
      conversationWorker.updateConversationForNewMessage
    );
  }

  public addConversationJob(name: string, data: IConversationJob): void {
    this.addJob(name, data);
  }
}

export const chatQueue: ChatQueue = new ChatQueue();
export const conversationQueue: ConversationQueue = new ConversationQueue();
