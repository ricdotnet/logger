import { JsonFormatter } from './formatters/json';
import { TLevel } from './level';
import { Console } from './transports/console';
import { Formatter, Transport } from './types';

type TOptions = {
  level?: TLevel;
  transports?: Transport[];
  context?: Record<string, unknown>;
  formatter?: Formatter;
};

class Logger {
  private level: TLevel = 'info';
  private transports: Transport[] = [new Console()];
  private context: Record<string, unknown>;
  private formatter: Formatter;

  constructor(options: TOptions = {}) {
    this.level = options.level || 'info';
    this.transports = [...this.transports, ...(options.transports || [])];
    this.context = options.context || {};
    this.formatter = options.formatter || new JsonFormatter();
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

    const output = this.formatter.format(entry);

    for (const transport of this.transports) {
      transport.write(entry, output);
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
