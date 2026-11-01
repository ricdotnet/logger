import { JsonFormatter } from './formatters/json';
import { ConsoleTransport } from './transports/console';
import { Formatter, LogLevel, Transport } from './types';

type TOptions = {
  level?: LogLevel;
  transports?: Transport[];
  context?: Record<string, unknown>;
  formatter?: Formatter;
};

export class Logger {
  private level: LogLevel = 'info';
  private transports: Transport[] = [new ConsoleTransport()];
  private context: Record<string, unknown>;
  private formatter: Formatter;

  constructor(options: TOptions = {}) {
    this.level = options.level || 'info';
    this.transports = [...this.transports, ...(options.transports || [])];
    this.context = options.context || {};
    this.formatter = options.formatter || new JsonFormatter();
  }

  info(message: string, context = {}): void {
    this.log('info', message, context);
  }

  error(message: string, context = {}): void {
    this.log('error', message, context);
  }

  log(level: LogLevel, message: string, context = {}): void {
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

  child(context: Record<string, unknown> = {}): Logger {
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

  private shouldLog(level: LogLevel) {
    return this.level === 'debug' || level === this.level;
  }
}
