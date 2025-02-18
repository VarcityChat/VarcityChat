import { IMessageDocument, IConversationDocument } from '@chat/interfaces/chat.interface';
import { BadRequestError } from '@global/helpers/error-handler';
import { chatService } from '@service/db/chat.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Get {
  public async conversationList(req: Request, res: Response): Promise<void> {
    const userId = req.currentUser!.userId;
    const list: IConversationDocument[] = await chatService.getConversationList(userId);
    res.status(HTTP_STATUS.OK).json({ message: 'User Conversations', list });
  }

  public async messages(req: Request, res: Response): Promise<void> {
    const { conversationId } = req.params;
    let messages: IMessageDocument[] = [];
    messages = await chatService.getMessages(conversationId);
    res.status(HTTP_STATUS.OK).json({ message: 'Chat Messages', messages });
  }

  public async messagesBySequence(req: Request, res: Response): Promise<void> {
    const { conversationId } = req.params;
    const { sequence } = req.query;
    let messages: IMessageDocument[] = [];
    messages = await chatService.getMessagesSinceSequence(
      conversationId,
      parseInt(sequence as string)
    );
    res.status(HTTP_STATUS.OK).json({ message: 'Chat Messages', messages });
  }

  public async messagesSince(req: Request, res: Response): Promise<void> {
    const { conversationId } = req.params;
    const { date } = req.query;

    const sinceDate = new Date(date as string);
    if (isNaN(sinceDate.getTime())) {
      throw new BadRequestError('Invalid date format');
    }

    let messages: IMessageDocument[] = [];
    messages = await chatService.getMessagesSince(conversationId, sinceDate);
    res.status(HTTP_STATUS.OK).json({ message: 'Chat Messages', messages });
  }
}

export const getChats: Get = new Get();
