import { TLevel } from './level';
import { Console } from './transports/console';
import { Transport } from './transports/transport';

type TOptions = {
  level?: TLevel;
  transports?: any[];
  context?: any;
  formatter?: any;
};

class Logger {
  private level: TLevel = 'info';
  private transports: Transport[] = [new Console()];
  private context: any = {};
  private formatter: any[] = [];

  constructor(options: TOptions = {}) {
    this.level = options.level || 'info';
    this.transports = [...this.transports, ...(options.transports || [])];
    this.context = options.context || {};
    this.formatter = options.formatter || {};
  }

  info(message: string, context = {}) {
    this.log('info', message, context);
  }

  error(message: string, context = {}) {
    this.log('error', message, context);
  }

  log(level: TLevel, message: string, context = {}) {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...this.context,
      ...context,
    };

    const output = this.formatter(entry);

    for (const transport of this.transports) {
      transport.write(output);
    }
  }

  child(context: any = {}) {
    return new Logger({
      level: this.level,
      transports: this.transports,
      formatter: this.formatter,
      context: {
        ...this.context,
        ...context,
      },
    });
  }

  private shouldLog(level: TLevel) {
    return this.level === 'debug' || level === this.level;
  }
}
