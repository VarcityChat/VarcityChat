import Queue, { Job } from 'bull';
import Logger from 'bunyan';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { config } from '@root/config';
import { IMessageJob } from '@chat/interfaces/chat.interface';

type IBaseJobData = IMessageJob;

let bullAdapters: BullAdapter[] = [];

export const serverAdapter: ExpressAdapter = new ExpressAdapter().setBasePath('/queues');

export abstract class BaseQueue {
  protected queue: Queue.Queue;
  log: Logger;

  constructor(queueName: string) {
    this.log = config.createLogger(`${queueName}Queue`);

    try {
      this.queue = new Queue(queueName, `${config.REDIS_HOST}`);

      bullAdapters.push(new BullAdapter(this.queue));
      bullAdapters = [...new Set(bullAdapters)];

      createBullBoard({
        queues: bullAdapters,
        serverAdapter
      });

      this.queue.on('completed', (job: Job) => job.remove());
      this.queue.on('global:completed', (jobId: string) =>
        this.log.info(`Job ${jobId} is completed`)
      );
      this.queue.on('global:stalled', (jobId: string) => this.log.info(`Job ${jobId} is stalled`));
    } catch (error) {
      this.log.error(`Error occurred in ${queueName}Queue: `, error);
      process.exit(1);
    }
  }

  protected addJob(name: string, data: IBaseJobData): void {
    this.queue.add(name, data, { attempts: 3, backoff: { type: 'fixed', delay: 5000 } });
  }

  protected processJob(
    name: string,
    concurrency: number,
    callback: Queue.ProcessCallbackFunction<void>
  ): void {
    this.queue.process(name, concurrency, callback);
  }
}
