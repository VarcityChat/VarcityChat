import { Application, json, urlencoded, Response, Request, NextFunction } from 'express';
import { CustomError, IErrorResponse } from '@global/helpers/error-handler';
import { config } from '@root/config';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { redisConnection } from '@service/redis/redis.connection';
import applicationRoutes from '@root/routes';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import mongosanitize from 'express-mongo-sanitize';
import cookie_session from 'cookie-session';
import Logger from 'bunyan';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors';

const SERVER_PORT = 8000;
const log: Logger = config.createLogger('Server');

export class VarcityServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.disable('x-powered-by');
    app.use(
      cookie_session({
        name: 'session',
        keys: ['test', 'test2'],
        maxAge: 24 * 7 * 3600000
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(mongosanitize());
    app.use(
      cors({
        origin: '*',
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  private routesMiddleware(app: Application): void {
    applicationRoutes(app);
    app.get('/', async (req: Request, res: Response) => {
      res.send('Ping from Varcity Backend');
    });
  }

  private globalErrorHandler(app: Application): void {
    app.all('*', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
    });

    app.use((err: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
      log.error(err);
      if (err instanceof CustomError) {
        res.status(err.statusCode).json(err.serializeErrors());
      } else {
        next();
      }
    });
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      const socketIO: Server = await this.createSocketIO(httpServer);
      this.startHttpServer(httpServer);
      this.socketIOConnections(socketIO);
    } catch (error) {
      log.error(error);
    }
  }

  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      }
    });
    const pubClient = redisConnection.connect();
    const subClient = redisConnection.connect();
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  private startHttpServer(httpServer: http.Server): void {
    log.info(`Server has started with process id ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Server running on port ${SERVER_PORT}`);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private socketIOConnections(io: Server): void {
    log.info('socketIO Connections');
  }
}
