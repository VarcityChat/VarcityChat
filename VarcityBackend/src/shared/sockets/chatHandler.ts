/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CONVERSATION_STATUS,
  IConversationDocument,
  IMessageData
} from '@chat/interfaces/chat.interface';
import { UserSocket } from './user';
import {
  ChatJobs,
  chatQueue,
  ConversationJobs,
  conversationQueue
} from '@service/queues/chat.queue';
import { chatService } from '@service/db/chat.service';
import { addChatSchema } from '@chat/schemes/chat.scheme';
import { config } from '@root/config';
import Logger from 'bunyan';
import Joi from 'joi';

const log: Logger = config.createLogger('ChatSocket Handler');

export class ChatHandler {
  private socket: UserSocket;

  constructor(socket: UserSocket) {
    this.socket = socket;
  }

  handle(): void {
    this.socket.on('new-message', async (message: IMessageData) => {
      console.log('\nMESSAGE COMING IN:', message);

      const error = await this.validateChatMessage(message);
      if (error) {
        log.error('Validation Error:', error.details);
        this.socket.emit('validation-error', {
          message: 'Validation Failed',
          details: error.details
        });
        return;
      }

      const createdAt = new Date();

      // Check if the conversation hasn't been accepted by the other user
      if (message.conversationStatus === CONVERSATION_STATUS.pending) {
        const conversation: IConversationDocument | null = await chatService.getConversationById(
          `${message.conversationId}`
        );
        if (!conversation) {
          return;
        }
      }

      conversationQueue.addConversationJob(ConversationJobs.increaseUnreadCount, {
        value: { sender: message.sender, receiver: message.receiver }
      });
      chatQueue.addChatJob(ChatJobs.addChatMessageToDB, { value: message });

      // TODO: send notification to user using queue
      console.log('SENDING MESSAGE TO USER:', message.receiver);
      message.createdAt = createdAt;

      this.socket.to(`${message.receiver}`).emit('new-message', message);
    });

    this.socket.on('typing', (data) => {});

    this.socket.on('message-read', (data) => {});
  }

  validateChatMessage(message: IMessageData): Promise<Joi.ValidationError | undefined> {
    const { error } = addChatSchema.validate(message);
    return Promise.resolve(error);
  }
}
