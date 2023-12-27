import * as fs from 'fs/promises';
import * as path from 'path';

export class Queue {
  private readonly logDir: string = 'some-dir';

  async writeToFile(message: any, type: string) {
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
        path.join(this.logDir, `${FULL_DATE}-${type}.log`),
      );
    } catch (e) {
      const data = 'Log Time: ' + FULL_TIME + '\n' + message + '\n\n';
      await fs.writeFile(
        path.join(this.logDir, `${FULL_DATE}-${type}.log`),
        data,
      );
    }

    if (logFile) {
      const data = logFile + 'Log Time: ' + FULL_TIME + '\n' + message + '\n\n';
      await fs.writeFile(
        path.join(this.logDir, `${FULL_DATE}-${type}.log`),
        data,
      );
    }
  }
}
