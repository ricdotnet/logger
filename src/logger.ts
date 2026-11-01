import { JsonFormatter } from './formatters/json';
import { ConsoleTransport } from './transports/console';
import { Formatter, LogLevel, Transport } from './types';

type TOptions = {
  name?: string;
  level?: LogLevel;
  transports?: Transport[];
  context?: Record<string, unknown>;
  formatter?: Formatter;
  redact?: string[];
};

export class Logger {
  private name: string;
  private level: LogLevel = 'info';
  private transports: Transport[] = [new ConsoleTransport()];
  private context: Record<string, unknown>;
  private formatter: Formatter;
  private redact: string[];

  constructor(options: TOptions = {}) {
    this.name = options.name || 'default';
    this.level = options.level || 'info';
    this.transports = [...this.transports, ...(options.transports || [])];
    this.context = options.context || {};
    this.formatter = options.formatter || new JsonFormatter();
    this.redact = options.redact || [];
  }

  trace(message: string, context = {}): void {
    this.log('trace', message, context);
  }

  debug(message: string, context = {}): void {
    this.log('debug', message, context);
  }

  info(message: string, context = {}): void {
    this.log('info', message, context);
  }

  warn(message: string, context = {}): void {
    this.log('warn', message, context);
  }

  error(message: string, context = {}): void {
    this.log('error', message, context);
  }

  fatal(message: string, context = {}): void {
    this.log('fatal', message, context);
  }

  log(level: LogLevel, message: string, context = {}): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const mergedContext: Record<string, unknown> = {
      ...this.context,
      ...context,
    };

    this.redact.forEach((key) => {
      if (mergedContext[key]) {
        mergedContext[key] = '******';
      }
    });

    const entry = {
      name: this.name,
      timestamp: new Date().toISOString(),
      level,
      message,
      context: mergedContext,
    };

    const output = this.formatter.format(entry);

    for (const transport of this.transports) {
      transport.write(entry, output);
    }
  }

  child(name: String, context: Record<string, unknown> = {}): Logger {
    return new Logger({
      name: `${this.name}.${name}`,
      level: this.level,
      transports: this.transports,
      formatter: this.formatter,
      redact: this.redact,
      context: {
        ...this.context,
        ...context,
      },
    });
  }

  get _name(): string {
    return this.name;
  }

  get _level(): LogLevel {
    return this.level;
  }

  get _transports(): Transport[] {
    return this.transports;
  }

  get _context(): Record<string, unknown> {
    return this.context;
  }

  get _formatter(): Formatter {
    return this.formatter;
  }

  get _redact(): string[] {
    return this.redact;
  }

  private shouldLog(level: LogLevel) {
    return this.level === 'debug' || level === this.level;
  }
}
