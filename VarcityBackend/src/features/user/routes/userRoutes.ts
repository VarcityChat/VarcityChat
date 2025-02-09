import express, { Router } from 'express';
import { updateUser } from '@user/controllers/update-user';

class UserRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.put('/user', updateUser.user);
    this.router.put('/user/status', updateUser.updateStatus);
    return this.router;
  }
}

export const userRoutes: UserRoutes = new UserRoutes();
