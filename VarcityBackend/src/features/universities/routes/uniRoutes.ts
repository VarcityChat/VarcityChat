import express, { Router } from 'express';
import { createUni } from '@uni/controllers/create-uni';
import { getUnis } from '@uni/controllers/get-uni';
import { getStudents } from '@uni/controllers/get-students';

class UniRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/uni', createUni.uni);
    this.router.get('/unis', getUnis.unis);
    this.router.get('/uni/:uniId/students', getStudents.students);
    return this.router;
  }
}

export const uniRoutes: UniRoutes = new UniRoutes();
