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

    return this.router;
  }
}

export const chatRoutes: ChatRoutes = new ChatRoutes();
