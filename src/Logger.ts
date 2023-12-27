import * as fs from 'fs/promises';
import { Constants } from './Constants';
import { ILogger, LogLevel, Primitives } from './Types';
import { Queue } from './Queue';

export class Logger {
  private readonly logDir: string;
  private readonly logToConsole: boolean;
  private readonly logToFile: boolean;
  private readonly level: LogLevel;
  private static logger: Logger = null;

  private readonly logQueue: Queue;

  constructor(options?: ILogger) {
    console.log('Initiating a logger...');
    if (Logger.logger) {
      console.warn('The logger was already initiated.');
      return;
    }
    // this.logDir = path.join(process.cwd(), options?.directory ?? 'Logs');
    this.logToConsole = options?.logToConsole ?? true;
    this.logToFile = options?.logToFile ?? false;
    this.level = options?.level ?? 'info';
    // this.checkLogDir();
    Logger.logger = this;

    if (this.logToFile) {
      this.logQueue = new Queue();
    }

    console.log('Logger initiated.');
  }

  static get(): Logger {
    return Logger.logger;
  }

  async checkLogDir() {
    try {
      await fs.mkdir(this.logDir);
      await this.info(`Logs folder generated. Logging to: ${this.logDir}`);
    } catch (error) {
      await this.info(`Logs folder already exists. Logging to: ${this.logDir}`);
    }
  }

  async debug<T = string>(message: T | Primitives) {
    if (this.logToFile) {
      //TODO: add to queue
    }
    if (this.logToConsole && this.level === 'debug') {
      console.debug(
        `${Constants.TEXT_CYAN}[DEBUG]:${Constants.RESET} ${JSON.stringify(
          message,
        )}`,
      );
    }
  }

  async info<T = string>(message: T | Primitives) {
    if (this.logToFile) {
      // TODO: add to queue
    }
    if (this.logToConsole) {
      // await this.writeToFile(JSON.stringify(message), 'info');
      console.log(
        `${Constants.TEXT_BLUE}[INFO]:${Constants.RESET} ${JSON.stringify(
          message,
        )}`,
      );
    }
  }

  async warn<T = string>(message: T | Primitives) {
    if (this.logToFile) {
      // TODO: add to queue
    }
    if (this.logToConsole) {
      // await this.writeToFile(JSON.stringify(message), 'warn');
      console.warn(
        `${Constants.TEXT_YELLOW}[WARN]:${Constants.RESET} ${JSON.stringify(
          message,
        )}`,
      );
    }
  }

  async error<T = string>(message: T | Primitives) {
    if (this.logToFile) {
      // TODO: add to queue
    }
    if (this.logToConsole) {
      // await this.writeToFile(JSON.stringify(message), 'error');
      console.error(
        `${Constants.TEXT_RED}[ERROR]:${Constants.RESET} ${JSON.stringify(
          message,
        )}`,
      );
    }
  }
}
