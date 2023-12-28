import { Logger } from '../src/Logger';

const loggerSpy = {
  debug: null,
  info: null,
  warn: null,
  error: null,
};

describe('Logger test', () => {
  beforeAll(() => {
    new Logger();

    loggerSpy.debug = jest.spyOn(Logger.get(), 'debug');
    loggerSpy.info = jest.spyOn(Logger.get(), 'info');
    loggerSpy.warn = jest.spyOn(Logger.get(), 'warn');
    loggerSpy.error = jest.spyOn(Logger.get(), 'error');
  });

  it('can log a debug', async () => {
    await Logger.get().debug('hello world');

    expect(loggerSpy.debug).toHaveBeenCalledWith('hello world');
    expect(loggerSpy.debug).toHaveBeenCalledTimes(1);
  });

  it('can log an info', async () => {
    await Logger.get().info('hello world');

    expect(loggerSpy.info).toHaveBeenCalledWith('hello world');
    expect(loggerSpy.info).toHaveBeenCalledTimes(1);
  });

  it('can log a warning', async () => {
    await Logger.get().warn('hello world');

    expect(loggerSpy.warn).toHaveBeenCalledWith('hello world');
    expect(loggerSpy.warn).toHaveBeenCalledTimes(1);
  });

  it('can log an error', async () => {
    await Logger.get().error('hello world');

    expect(loggerSpy.error).toHaveBeenCalledWith('hello world');
    expect(loggerSpy.error).toHaveBeenCalledTimes(1);
  });
});
