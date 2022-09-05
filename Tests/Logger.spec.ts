import { Logger } from '../src/Logger';
import * as fs from 'fs/promises';
import * as path from 'path';

const loggerSpy = {
  info: null,
  warn: null,
  error: null,
};

const consoleSpy = {
  info: jest.spyOn(console, 'log'),
  warn: jest.spyOn(console, 'warn'),
  error: jest.spyOn(console, 'error'),
};

describe('Logger test', () => {
  let loggerInstance: Logger;

  beforeAll(() => {
    loggerInstance = new Logger();

    loggerSpy.info = jest.spyOn(loggerInstance, 'info');
    loggerSpy.warn = jest.spyOn(loggerInstance, 'warn');
    loggerSpy.error = jest.spyOn(loggerInstance, 'error');
  });

  afterAll(async () => {
    await fs.rm(path.join(process.cwd(), 'Logs'), { recursive: true });
  });

  it('can log an info', async () => {
    await loggerInstance.info('hello world');

    expect(loggerSpy.info).toHaveBeenCalledWith('hello world');
    expect(consoleSpy.info).toHaveBeenCalledTimes(1);
  });

  it('can log a warning', async () => {
    await loggerInstance.warn('hello world');

    expect(loggerSpy.warn).toHaveBeenCalledWith('hello world');
    expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
  });

  it('can log an error', async () => {
    await loggerInstance.error('hello world');

    expect(loggerSpy.error).toHaveBeenCalledWith('hello world');
    expect(consoleSpy.error).toHaveBeenCalledTimes(1);
  });
});
