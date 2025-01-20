import { authRoutes } from '@auth/routes/authRoutes';
import { uniRoutes } from '@uni/routes/uniRoutes';
import { notificationRoutes } from '@notification/routes/notificationRoutes';
import { Application } from 'express';
import { config } from './config';
import { authMiddleware } from '@global/middlewares/auth.middleware';
import { chatRoutes } from '@chat/routes/chatRoutes';
import { serverAdapter } from '@service/queues/base.queue';

const BASE_PATH = '/api/v1';

export default (app: Application) => {
  const routes = () => {
    app.use('/queues', serverAdapter.getRouter());
    app.use(BASE_PATH, authRoutes.routes());

    // Enable route only in development mode
    if (config.NODE_ENV == 'development') {
      app.use(BASE_PATH, notificationRoutes.routes());
      app.use(BASE_PATH, uniRoutes.routes());
      app.use(BASE_PATH, authMiddleware.protect, chatRoutes.routes());
    }
  };

  return routes();
};
