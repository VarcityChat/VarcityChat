import express, { Express } from 'express';
import { VarcityServer } from '@root/server';
import { config } from '@root/config';
import { redisConnection } from '@service/redis/redis.connection';
import dbConnection from '@root/setupDb';
import Logger from 'bunyan';

const log: Logger = config.createLogger('app');

class Application {
  public init(): void {
    this.loadConfig();
    dbConnection();
    const app: Express = express();
    const server: VarcityServer = new VarcityServer(app);
    server.start();
    this.handleExit();
  }

  private loadConfig(): void {
    config.validateConfig();
    config.cloudinaryConfig();
  }

  private handleExit(): void {
    process.on('uncaughtException', (error: Error) => {
      log.error('There was an uncaught error', error);
      this.shutDownProperly(1);
    });

    process.on('unhandledRejection', (reason: Error) => {
      log.error(`\nUnhandled reject at promise: ${reason}`);
      this.shutDownProperly(2);
    });

    process.on('SIGTERM', () => {
      log.error('Caught SIGTERM');
      this.shutDownProperly(1);
    });

    process.on('SIGINT', () => {
      log.error('Caught SigInt');
      this.shutDownProperly(1);
    });

    process.on('exit', () => {
      log.error('Exiting...');
    });
  }

  private async shutDownProperly(exitCode: number) {
    try {
      await redisConnection.closeConnection();
      process.exit(exitCode);
    } catch (error) {
      log.error(`Error while shutting down: ${error}`);
      process.exit(1);
    }
  }
}

const application: Application = new Application();
application.init();
