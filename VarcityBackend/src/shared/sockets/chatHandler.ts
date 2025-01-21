/* eslint-disable @typescript-eslint/no-unused-vars */
import { IMessageData } from '@chat/interfaces/chat.interface';
import { UserSocket } from './user';
import { ChatJobs, chatQueue } from '@service/queues/chat.queue';
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
      const error = await this.validateChatMessage(message);
      if (error) {
        log.error('Validation Error:', error.details);
        this.socket.emit('validation-error', {
          message: 'Validation Failed',
          details: error.details
        });
        return;
      }

      chatQueue.addChatJob(ChatJobs.addChatMessageToDB, { value: message });

      // TODO: send notification to user using queue

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
