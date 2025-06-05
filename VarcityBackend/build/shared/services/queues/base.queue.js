"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseQueue = exports.serverAdapter = void 0;
const bull_1 = __importDefault(require("bull"));
const api_1 = require("@bull-board/api");
const bullAdapter_1 = require("@bull-board/api/bullAdapter");
const express_1 = require("@bull-board/express");
const config_1 = require("../../../config");
let bullAdapters = [];
exports.serverAdapter = new express_1.ExpressAdapter().setBasePath('/queues');
class BaseQueue {
    constructor(queueName) {
        this.log = config_1.config.createLogger(`${queueName}Queue`);
        try {
            this.queue = new bull_1.default(queueName, `${config_1.config.REDIS_HOST}`);
            bullAdapters.push(new bullAdapter_1.BullAdapter(this.queue));
            bullAdapters = [...new Set(bullAdapters)];
            (0, api_1.createBullBoard)({
                queues: bullAdapters,
                serverAdapter: exports.serverAdapter
            });
            this.queue.on('completed', (job) => job.remove());
            this.queue.on('global:completed', (jobId) => this.log.info(`Job ${jobId} is completed`));
            this.queue.on('global:stalled', (jobId) => this.log.info(`Job ${jobId} is stalled`));
            this.queue.on('error', (err) => {
                this.log.error(`Queue ${queueName} error:`, err);
            });
        }
        catch (error) {
            this.log.error(`Error occurred in ${queueName}Queue: `, error);
            process.exit(1);
        }
    }
    addJob(name, data) {
        this.queue.add(name, data, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 },
            removeOnComplete: true,
            removeOnFail: false,
            timeout: 5000
        });
    }
    processJob(name, concurrency, callback) {
        this.queue.process(name, concurrency, callback);
    }
}
exports.BaseQueue = BaseQueue;
//# sourceMappingURL=base.queue.js.map