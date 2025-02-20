/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CONVERSATION_STATUS,
  IConversationDocument,
  IMarkConversationAsRead,
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
import { ObjectId } from 'mongodb';

const log: Logger = config.createLogger('ChatSocket Handler');

export class ChatHandler {
  private socket: UserSocket;

  constructor(socket: UserSocket) {
    this.socket = socket;
  }

  handle(): void {
    /**
     * Handle Incoming Message Event
     *
     */
    this.socket.on('new-message', async (message: IMessageData, callback) => {
      console.log('\nMESSAGE COMING IN:', message);

      // validate the message to ensure it contains required field (especially localID and conversationID)
      const error = await this.validateChatMessage(message);
      if (error) {
        log.error('Validation Error:', error.details);
        this.socket.emit('validation-error', {
          message: 'Validation Failed',
          details: error.details
        });
        callback({ success: false });
        return;
      }

      // don't continue processing if conversation hasn't been accepted by the receiver
      if (message.conversationStatus === CONVERSATION_STATUS.pending) {
        const conversation: IConversationDocument | null = await chatService.getConversationById(
          `${message.conversationId}`
        );
        if (!conversation) {
          return;
        }
      }

      // create server timestamp and objectId for the message
      const createdAt = new Date();
      const messageObjectID = new ObjectId();
      const sequence = await chatService.getNextSequence(`${message.conversationId}`);
      message['sequence'] = sequence;
      message['createdAt'] = createdAt;

      // update the unread users account in a queue
      conversationQueue.addConversationJob(ConversationJobs.updateConversationForNewMessage, {
        value: {
          sender: message.sender,
          receiver: message.receiver,
          lastMessageTimestamp: message.createdAt,
          lastMessage: `${messageObjectID}`
        }
      });

      // add the message to db in a queue
      chatQueue.addChatJob(ChatJobs.addChatMessageToDB, {
        value: { ...message, _id: messageObjectID }
      });

      // TODO: send notification to user using queue
      console.log('SENDING MESSAGE TO RECEIVER:', message.receiver);

      // emit event to the receiver with acknowledgment of (success: true) to the message sender
      this.socket
        .to(`${message.receiver}`)
        .emit('new-message', { _id: messageObjectID, ...message });
      if (callback) {
        callback({
          success: true,
          serverId: messageObjectID,
          localId: message.localId,
          serverSequence: message.sequence,
          messageCreatedAt: createdAt
        });
      }
    });

    this.socket.on('typing', (data) => {});

    this.socket.on('mark-conversation-as-read', async (data: IMarkConversationAsRead) => {
      const { conversationId, userId, user1Id, user2Id } = data;
      // userId: id of the current authenticated user
      // user1Id: id of the conversation user1
      // user2Id: id of the conversation user2
      if (
        !conversationId ||
        !userId ||
        !user1Id ||
        !user2Id ||
        (userId !== user1Id && userId !== user2Id)
      ) {
        return;
      }

      await chatService.markConversationAsReadForUser(
        `${conversationId}`,
        userId === user1Id ? 'user1' : 'user2'
      );
    });
  }

  validateChatMessage(message: IMessageData): Promise<Joi.ValidationError | undefined> {
    const { error } = addChatSchema.validate(message);
    return Promise.resolve(error);
  }
}
