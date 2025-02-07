import { CONVERSATION_STATUS, IConversationDocument } from '@chat/interfaces/chat.interface';
import { acceptConversationSchema, addConversationSchema } from '@chat/schemes/chat.scheme';
import { validator } from '@global/decorators/joi-validation-decorator';
import { BadRequestError, NotAuthorizedError, NotFoundError } from '@global/helpers/error-handler';
import { chatService } from '@service/db/chat.service';
import { notificationService } from '@service/db/notification.service';
import { userService } from '@service/db/user.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Add {
  @validator(addConversationSchema)
  public async conversation(req: Request, res: Response): Promise<void> {
    const { targetUserId } = req.body;
    if (!targetUserId) throw new BadRequestError('userId is required');

    const targetUser = await userService.getUserById(targetUserId);
    if (!targetUser) throw new NotFoundError('Target User does not exist');

    const conversation: IConversationDocument = await chatService.initializeConversation(
      req.currentUser!.userId,
      targetUserId
    );

    await notificationService.saveNotificationToDb(targetUserId, {
      body: `${targetUser.firstname}: sent you a new message request`,
      title: 'New Message Request'
    });
    // TODO: send push notification to 'targetUserId' informing on new message request

    res.status(HTTP_STATUS.CREATED).json({ message: 'Conversation created', conversation });
  }

  @validator(acceptConversationSchema)
  public async acceptConversationRequest(req: Request, res: Response): Promise<void> {
    const { conversationId } = req.body;
    const conversation: IConversationDocument | null =
      await chatService.getConversationById(conversationId);
    if (!conversation) throw new NotFoundError('Conversation does not exist');

    if (conversation.status === CONVERSATION_STATUS.rejected) {
      throw new BadRequestError('Conversation request already rejected');
    }

    if (conversation.status != CONVERSATION_STATUS.pending) {
      throw new BadRequestError('Cannot accept the conversation again');
    }

    if (conversation.user2.toString() !== req.currentUser?.userId) {
      throw new NotAuthorizedError('You cannot accept this conversation');
    }

    await chatService.acceptConversationRequest(conversationId);
    res.status(HTTP_STATUS.OK).json({ message: 'Message request accepted', conversation });
  }

  @validator(acceptConversationSchema)
  public async rejectConversationRequest(req: Request, res: Response): Promise<void> {
    const { conversationId } = req.body;
    const conversation: IConversationDocument | null =
      await chatService.getConversationById(conversationId);
    if (!conversation) throw new NotFoundError('Conversation does not exist');

    if (conversation.status === CONVERSATION_STATUS.accepted) {
      throw new BadRequestError('Conversation request already accepted');
    }

    if (conversation.user2.toString() !== req.currentUser?.userId) {
      throw new NotAuthorizedError('You cannot accept this conversation');
    }

    await chatService.rejectConversationRequest(conversationId);
    res.status(HTTP_STATUS.OK).json({ message: 'Message request rejected', conversation });
  }
}

export const createChat: Add = new Add();
