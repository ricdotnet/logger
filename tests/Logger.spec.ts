import { LogLevels } from '../src/Constants';
import { Logger } from '../src/Logger';

const loggerSpy: { [key: string]: any } = {
  debug: null,
  info: null,
  warn: null,
  error: null,
  fmt: null,
};

describe('Logger test', () => {
  beforeEach(() => {
    new Logger();

    loggerSpy.debug = jest.spyOn(Logger.get(), LogLevels.DEBUG);
    loggerSpy.info = jest.spyOn(Logger.get(), LogLevels.INFO);
    loggerSpy.warn = jest.spyOn(Logger.get(), LogLevels.WARN);
    loggerSpy.error = jest.spyOn(Logger.get(), LogLevels.ERROR);
    loggerSpy.fmt = jest.spyOn(Logger.get(), 'fmt');
  });
  
  afterEach(() => {
    Logger.dispose();
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
  
  it('can format a message', async () => {
    await Logger.get().fmt(LogLevels.INFO, 'Hello {}', 'world');
    
    expect(loggerSpy.fmt).toHaveBeenCalledWith(LogLevels.INFO, 'Hello {}', 'world');
    expect(loggerSpy.fmt).toHaveBeenCalledTimes(1);
    expect(loggerSpy.info).toHaveBeenCalledWith('Hello world');
    expect(loggerSpy.info).toHaveBeenCalledTimes(1);
  });
});
