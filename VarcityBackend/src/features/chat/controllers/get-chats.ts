import { IConversationDocument } from '@chat/interfaces/conversation.interface';
import { IMessageDocument } from '@chat/interfaces/message.interface';
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
}

export const getChats: Get = new Get();
