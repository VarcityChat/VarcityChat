import express, { Router } from 'express';
import { signin } from '@auth/controllers/signin';
import { signup } from '@auth/controllers/signup';
import { password } from '@auth/controllers/password';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/signin', signin.read);
    this.router.post('/signup', signup.create);

    this.router.post('/forgot-password', password.create);
    this.router.post('/reset-password', password.update);
    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
