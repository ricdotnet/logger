import * as fs from 'fs/promises';
import { Constants, LogLevels } from './Constants';
import { ILogger, LogLevel } from './Types';
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

    this.logToConsole = options?.logToConsole ?? true;
    this.logToFile = options?.logToFile ?? false;
    this.level = options?.level ?? LogLevels.INFO;

    Logger.logger = this;

    if (this.logToFile) {
      this.logQueue = new Queue(options);
    }

    console.log('Logger initiated.');
  }

  static get(): Logger {
    return Logger.logger;
  }
  
  static dispose(): void {
    this.logger = null;
  }

  async debug(message: string) {
    if (this.logToFile) {
      this.logQueue.add(message, LogLevels.DEBUG);
    }
    if (this.logToConsole && this.level === 'debug') {
      console.debug(
        `${Constants.TEXT_CYAN}[DEBUG] (${new Date()}):${Constants.RESET} ${message}`,
      );
    }
  }

  async info(message: string) {
    if (this.logToFile) {
      this.logQueue.add(message, LogLevels.DEBUG);
    }
    if (this.logToConsole) {
      console.log(`${Constants.TEXT_BLUE}[INFO] (${new Date()}):${Constants.RESET} ${message}`);
    }
  }

  async warn(message: string) {
    if (this.logToFile) {
      this.logQueue.add(message, LogLevels.WARN);
    }
    if (this.logToConsole) {
      console.warn(
        `${Constants.TEXT_YELLOW}[WARN] (${new Date()}):${Constants.RESET} ${message}`,
      );
    }
  }

  async error(message: string) {
    if (this.logToFile) {
      this.logQueue.add(message, LogLevels.ERROR);
    }
    if (this.logToConsole) {
      console.error(
        `${Constants.TEXT_RED}[ERROR] (${new Date()}):${Constants.RESET} ${message}`,
      );
    }
  }
  
  async fmt(lvl: LogLevel, msg: string, ...args: string[]) {
    let _msg = msg;
    
    while (args.length > 0) {
      _msg = _msg.replace('{}', args.shift());
    }
    
    this[lvl](_msg);
  }
}
