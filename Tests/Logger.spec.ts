import { Logger } from '../src/Logger';
import { Constants } from '../src/Constants';


// const loggerSpy = {
//   info: jest.spyOn(Logger.getInstance(), 'info'),
//   warn: jest.spyOn(Logger.getInstance(), 'warn'),
//   error: jest.spyOn(Logger.getInstance(), 'error')
// };

const consoleSpy = {
  info: jest.spyOn(console, 'log'),
  warn: jest.spyOn(console, 'warn'),
  error: jest.spyOn(console, 'error'),
};

describe('Logger test', () => {
  let loggerInstance;
  let loggerSpy;

  beforeEach(() => {
    loggerInstance = new Logger();

    loggerSpy = {
      info: jest.spyOn(loggerInstance, 'info'),
      warn: jest.spyOn(loggerInstance, 'warn'),
      error: jest.spyOn(loggerInstance, 'error')
    };

    loggerSpy.info.mockClear();
    loggerSpy.warn.mockClear();
    loggerSpy.error.mockClear();
  });

  it('can log an info', async () => {
    await loggerInstance.info('hello world');

    await expect(loggerSpy.info).toHaveBeenCalledWith('hello world');
    await expect(consoleSpy.info).toHaveBeenCalledWith(`${Constants.TEXT_BLUE}[INFO]: hello world`);
  });

  it('can log a warning', () => {
    loggerInstance.warn('hello world');

    expect(loggerSpy.warn).toHaveBeenCalledWith('hello world');
    // expect(consoleSpy.warn).toHaveBeenCalledWith(`${Constants.TEXT_YELLOW}[WARN]: hello world`);
  });

  it('can log an error', () => {
    loggerInstance.error('hello world');

    expect(loggerSpy.error).toHaveBeenCalledWith('hello world');
    expect(consoleSpy.error).toHaveBeenCalledWith(`${Constants.TEXT_RED}[ERROR]: hello world`);
  });
});
