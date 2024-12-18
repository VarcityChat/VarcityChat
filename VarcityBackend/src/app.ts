import express, { Express } from 'express';
import { VarcityServer } from './server';
import { config } from './config';
import dbConnection from './setupDb';

class Application {
  public init(): void {
    this.loadConfig();
    dbConnection();
    const app: Express = express();
    const server: VarcityServer = new VarcityServer(app);
    server.start();
  }

  private loadConfig(): void {
    config.validateConfig();
  }
}

const application: Application = new Application();
application.init();
