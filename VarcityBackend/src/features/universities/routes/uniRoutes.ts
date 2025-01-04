import express, { Router } from 'express';
import { createUni } from '@uni/controllers/create-uni';

class UniRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/uni', createUni.uni);

    return this.router;
  }
}

export const uniRoutes: UniRoutes = new UniRoutes();
