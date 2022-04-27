import * as fs from 'fs/promises';
import * as path from 'path';
import { Constants } from './Constants';

// some places use any just because I do not want to deal with multiple types of data...
// I guess generics would be cool here but eh
// TODO: Multiple log folders for [info, warn, error]

export class Logger {

  static LOG_DIR = './Logs';

  static async checkLogDir() {
    const dirs = await fs.readdir('./');
    if ( !dirs.includes(this.LOG_DIR.split('/')[1]) ) {
      await fs.mkdir(this.LOG_DIR);
      return this.info('Logs folder generated.');
    }

    // return this.info('Logs folder already exists... The logger will write inside it.');
  }

  static async info(message: any) {
    await this.writeToFile(message, 'info');
    console.log(`${Constants.TEXT_BLUE}[INFO]: ${message}`);
  }

  static async warn(message: any) {
    await this.writeToFile(message, 'warn');
    console.warn(`${Constants.TEXT_YELLOW}[WARN]: ${message}`);
  }

  static async error(message: any) {
    await this.writeToFile(message, 'error');
    console.error(`${Constants.TEXT_RED}[ERROR]: ${message}`);
  }

  static async writeToFile(message: any, type: string) {
    const DAY: number     = new Date().getDate();
    const MONTH: number   = new Date().getMonth() + 1; // +1 because it goes 0-11
    const YEAR: number    = new Date().getFullYear();
    const HOURS: number   = new Date().getHours();
    const MINUTES: number = new Date().getMinutes();

    const FULL_DATE: string = [DAY, MONTH, YEAR].join('-');
    const FULL_TIME: string = [HOURS, MINUTES].join(':');

    let logFile;
    try {
      logFile = await fs.readFile(path.join(this.LOG_DIR, `${FULL_DATE}-${type}.log`));
    } catch (e) {
      // console.error(e);
      // let me just fail silently if the file does not exist
    }

    if ( !logFile ) {
      const data = 'Log Time: ' + FULL_TIME + '\n' + message + '\n\n';
      return await fs.writeFile(path.join(this.LOG_DIR, `${FULL_DATE}-${type}.log`), data);
    }

    const data = logFile + 'Log Time: ' + FULL_TIME + '\n' + message + '\n\n';
    return await fs.writeFile(path.join(this.LOG_DIR, `${FULL_DATE}-${type}.log`), data);
  }

}
