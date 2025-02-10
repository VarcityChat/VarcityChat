import express, { Router } from 'express';
import { updateUser } from '@user/controllers/update-user';
import { getUser } from '@user/controllers/get-user';

class UserRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.put('/user', updateUser.user);
    this.router.put('/user/status', updateUser.updateStatus);

    this.router.get('/user/:userId', getUser.byId);

    return this.router;
  }
}

export const userRoutes: UserRoutes = new UserRoutes();
