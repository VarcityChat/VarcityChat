import express, { Express } from 'express';
import { VarcityServer } from '@root/server';
import { config } from '@root/config';
import dbConnection from '@root/setupDb';

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
    config.cloudinaryConfig();
  }
}

const application: Application = new Application();
application.init();
