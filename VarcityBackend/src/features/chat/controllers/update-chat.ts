import { CONVERSATION_STATUS, IConversationDocument } from '@chat/interfaces/chat.interface';
import { acceptConversationSchema } from '@chat/schemes/chat.scheme';
import { validator } from '@global/decorators/joi-validation-decorator';
import { BadRequestError, NotAuthorizedError, NotFoundError } from '@global/helpers/error-handler';
import { chatService } from '@service/db/chat.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Update {
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

export const updateChat: Update = new Update();
