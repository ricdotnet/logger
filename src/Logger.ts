import * as fs from 'fs/promises';
import * as path from 'path';
import { Constants } from './Constants';
import { ILogger, Primitives } from './Types';

export class Logger {

  private readonly logDir: string;
  private readonly logToConsole: boolean;

  constructor(options?: ILogger) {
    this.logDir = path.join(process.cwd(), options?.directory ?? 'Logs');
    this.logToConsole = options?.logToConsole ?? true;
    this.checkLogDir();
  }

  async checkLogDir() {
    try {
      await fs.mkdir(this.logDir);
      await this.info(`Logs folder generated. Logging to: ${this.logDir}`);
    } catch (error) {
      await this.info(`Logs folder already exists. Logging to: ${this.logDir}`);
    }
  }

  async info<T = string>(message: T | Primitives) {
    await this.writeToFile(JSON.stringify(message), 'info');
    if (this.logToConsole) {
      console.log(`${Constants.TEXT_BLUE}[INFO]:${Constants.RESET} ${JSON.stringify(message)}`);
    }
  }

  async warn<T = string>(message: T | Primitives) {
    await this.writeToFile(JSON.stringify(message), 'warn');
    if (this.logToConsole) {
      console.warn(`${Constants.TEXT_YELLOW}[WARN]:${Constants.RESET} ${JSON.stringify(message)}`);
    }
  }

  async error<T = string>(message: T | Primitives) {
    await this.writeToFile(JSON.stringify(message), 'error');
    if (this.logToConsole) {
      console.error(`${Constants.TEXT_RED}[ERROR]:${Constants.RESET} ${JSON.stringify(message)}`);
    }
  }

  async writeToFile(message: any, type: string) {
    const DAY: number = new Date().getDate();
    const MONTH: number = new Date().getMonth() + 1; // +1 because it goes 0-11
    const YEAR: number = new Date().getFullYear();
    const HOURS: number = new Date().getHours();
    const MINUTES: number = new Date().getMinutes();

    const FULL_DATE: string = [DAY, MONTH, YEAR].join('-');
    const FULL_TIME: string = [HOURS, MINUTES].join(':');

    let logFile;
    try {
      logFile = await fs.readFile(path.join(this.logDir, `${FULL_DATE}-${type}.log`));
    } catch (e) {
      const data = 'Log Time: ' + FULL_TIME + '\n' + message + '\n\n';
      await fs.writeFile(path.join(this.logDir, `${FULL_DATE}-${type}.log`), data);
    }

    if (logFile) {
      const data = logFile + 'Log Time: ' + FULL_TIME + '\n' + message + '\n\n';
      await fs.writeFile(path.join(this.logDir, `${FULL_DATE}-${type}.log`), data);
    }
  }

}
