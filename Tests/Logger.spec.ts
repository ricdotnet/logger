import { Logger } from '../src/Logger';
import { Constants } from '../src/Constants';

const loggerSpy = {
  info : jest.spyOn(Logger, 'info'),
  warn : jest.spyOn(Logger, 'warn'),
  error: jest.spyOn(Logger, 'error')
};

const consoleSpy = {
  info : jest.spyOn(console, 'log'),
  warn : jest.spyOn(console, 'warn'),
  error: jest.spyOn(console, 'error'),
};

describe('Logger test', () => {

  beforeEach(() => {
    loggerSpy.info.mockClear();
    loggerSpy.warn.mockClear();
    loggerSpy.error.mockClear();
  });

  it('can log an info and check the output', () => {
    Logger.info('hello world');

    expect(loggerSpy.info).toHaveBeenCalledWith('hello world');
    expect(consoleSpy.info).toHaveBeenCalledWith(`${Constants.TEXT_BLUE}[INFO]: hello world`);
  });

  it('can log a warning', () => {
    Logger.warn('hello world');

    expect(loggerSpy.warn).toHaveBeenCalledWith('hello world');
    expect(consoleSpy.warn).toHaveBeenCalledWith(`${Constants.TEXT_YELLOW}[WARN]: hello world`);
  });

  it('can log an error', () => {
    Logger.error('hello world');

    expect(loggerSpy.error).toHaveBeenCalledWith('hello world');
    expect(consoleSpy.error).toHaveBeenCalledWith(`${Constants.TEXT_RED}[ERROR]: hello world`);
  });
});
