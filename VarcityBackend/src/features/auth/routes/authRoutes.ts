import express, { Router } from 'express';
import { signin } from '@auth/controllers/signin';
import { signup } from '@auth/controllers/signup';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/signin', signin.read);
    this.router.post('/signup', signup.create);
    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
