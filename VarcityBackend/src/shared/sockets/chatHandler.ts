/* eslint-disable @typescript-eslint/no-unused-vars */
import { IMessageData } from '@chat/interfaces/chat.interface';
import { UserSocket } from './user';
import { ChatJobs, chatQueue } from '@service/queues/chat.queue';

export class ChatHandler {
  private socket: UserSocket;

  constructor(socket: UserSocket) {
    this.socket = socket;
  }

  handle(): void {
    this.socket.on('new-message', (message: IMessageData) => {
      console.log('\nMESSAGE:', message.sender);
      chatQueue.addChatJob(ChatJobs.addChatMessageToDB, { value: message });
      this.socket.to(`${message.receiver}`).emit('new-message', message);
    });

    this.socket.on('typing', (data) => {});

    this.socket.on('message-read', (data) => {});
  }
}
