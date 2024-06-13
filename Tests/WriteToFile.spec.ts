import * as fs from 'fs/promises';
import * as path from 'path';
import { Logger } from '../src/Logger';
import { Queue } from '../src/Queue';
import { sleep } from '../src/Utils';

const spy: { [key: string]: any } = {
  writeToFile: null,
}

describe('Write to file test', () => {
  beforeAll(() => {
    new Logger({
      logToFile: true,
      logToConsole: false,
    });

    spy.writeToFile = jest.spyOn(Queue.prototype as any, 'writeToFile');
  });

  afterAll(async () => {
    await sleep();

    const logsPath = path.join(process.cwd(), 'Logs');

    const files = await fs.readdir(logsPath);

    for (let file of files) {
      await fs.rm(path.join(logsPath, file), { force: true });
    }

    await fs.rmdir(logsPath);
  });

  it('can write a debug log to file', async () => {
    await Logger.get().debug('hello world');
    expect(spy.writeToFile).toHaveBeenCalledTimes(1);
  });

  it('can write an info log to file', async () => {
    await Logger.get().info('hello world');
    expect(spy.writeToFile).toHaveBeenCalledTimes(1);
  });

  it('can write a warn log to file', async () => {
    await Logger.get().warn('hello world');
    expect(spy.writeToFile).toHaveBeenCalledTimes(1);
  });

  it('can write an error log to file', async () => {
    await Logger.get().error('hello world');
    expect(spy.writeToFile).toHaveBeenCalledTimes(1);
  });
});
