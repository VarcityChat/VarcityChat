import express, { Router } from 'express';
import { createUni } from '@uni/controllers/create-uni';
import { getUnis } from '@uni/controllers/get-uni';
import { getStudents } from '@uni/controllers/get-students';
import { authMiddleware } from '@global/middlewares/auth.middleware';

class UniRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/unis', getUnis.unis);
    this.router.post('/uni', authMiddleware.protect, createUni.uni);
    this.router.get('/uni/:uniId/students', authMiddleware.protect, getStudents.students);
    return this.router;
  }
}

export const uniRoutes: UniRoutes = new UniRoutes();
