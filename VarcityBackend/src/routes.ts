import { authRoutes } from '@auth/routes/authRoutes';
import { uniRoutes } from '@uni/routes/uniRoutes';
import { Application } from 'express';
import { config } from './config';

const BASE_PATH = '/api/v1';

export default (app: Application) => {
  const routes = () => {
    app.use(BASE_PATH, authRoutes.routes());

    // Enable route only in development mode
    if (config.NODE_ENV == 'development') {
      app.use(BASE_PATH, uniRoutes.routes());
    }
  };

  return routes();
};
