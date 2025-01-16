import { createChat } from '@chat/controllers/create-chat';
import { getChats } from '@chat/controllers/get-chats';
import express, { Router } from 'express';

class ChatRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    // Get all conversations for the authenticated user
    this.router.get('/chat/conversations', getChats.conversationList);
    this.router.get('/chat/:conversationId/messages', getChats.messages);

    // Open a chat with a user
    this.router.post('/chat/open', createChat.conversation);

    return this.router;
  }
}

export const chatRoutes: ChatRoutes = new ChatRoutes();
