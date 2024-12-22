import express, { Router } from 'express';
import { signin } from '@auth/controllers/signin';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/signin', signin.read);
    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
