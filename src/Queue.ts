import * as fs from 'fs/promises';
import * as path from 'path';
import { ILogger, LogLevel, LogObject } from './Types';
import {Logger} from "./Logger";

export class Queue {
  private logQueue: LogObject[];
  private isRunning: boolean;
  private readonly logDir: string;

  constructor(options: ILogger) {
    this.logQueue = [];
    this.isRunning = false;
    this.logDir = options?.directory ?? 'Logs';
    this.checkLogDir();
  }

  // TODO: update this maybe
  private async checkLogDir() {
    try {
      await fs.mkdir(this.logDir);
      await Logger.get().debug(`Logs folder generated. Logging to: ${this.logDir}`);
    } catch (error) {
      await Logger.get().debug(`Logs folder already exists. Logging to: ${this.logDir}`);
    }
  }


  add(message: string, level: LogLevel) {
    this.logQueue.push({ message, level });
    if (!this.isRunning) {
      this.isRunning = true;
      this.runQueue();
    }
  }

  async runQueue(): Promise<void> {
    const { message, level } = this.logQueue.shift();
    await this.writeToFile(message, level);
    if (this.logQueue.length) {
      return this.runQueue();
    }
    this.isRunning = false;
  }

  // TODO: rewrite better...
  private async writeToFile(message: string, level: LogLevel) {
    const DAY: number = new Date().getDate();
    const MONTH: number = new Date().getMonth() + 1; // +1 because it goes 0-11
    const YEAR: number = new Date().getFullYear();
    const HOURS: number = new Date().getHours();
    const MINUTES: number = new Date().getMinutes();

    const FULL_DATE: string = [DAY, MONTH, YEAR].join('-');
    const FULL_TIME: string = [HOURS, MINUTES].join(':');

    let logFile: string | Buffer;
    try {
      logFile = await fs.readFile(
        path.join(this.logDir, `${FULL_DATE}-${level}.log`),
      );
    } catch (e) {
      const data = 'Log Time: ' + FULL_TIME + '\n' + message + '\n\n';
      await fs.writeFile(
        path.join(this.logDir, `${FULL_DATE}-${level}.log`),
        data,
      );
    }

    if (logFile) {
      const data = logFile + 'Log Time: ' + FULL_TIME + '\n' + message + '\n\n';
      await fs.writeFile(
        path.join(this.logDir, `${FULL_DATE}-${level}.log`),
        data,
      );
    }
  }
}
