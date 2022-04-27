import { Logger } from './src/Logger';

(async () => {
  await Logger.checkLogDir();
  await Logger.info('some info message');
  await Logger.warn('some warn message');
  await Logger.error('some error message');
})();
