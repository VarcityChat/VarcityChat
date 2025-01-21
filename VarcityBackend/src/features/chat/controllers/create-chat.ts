import { IConversationDocument } from '@chat/interfaces/chat.interface';
import { BadRequestError } from '@global/helpers/error-handler';
import { chatService } from '@service/db/chat.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Add {
  public async conversation(req: Request, res: Response): Promise<void> {
    const { targetUserId } = req.body;
    if (!targetUserId) throw new BadRequestError('userId is required');

    const conversation: IConversationDocument = await chatService.initializeConversation(
      req.currentUser!.userId,
      targetUserId
    );
    res.status(HTTP_STATUS.CREATED).json({ message: 'Conversation created', conversation });
  }
}

export const createChat: Add = new Add();
