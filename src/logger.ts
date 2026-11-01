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
  redactString?: string;
};

export class Logger {
  private name: string;
  private level: LogLevel;
  private transports: Transport[] = [new ConsoleTransport()];
  private context: Record<string, unknown>;
  private formatter: Formatter;
  private redact: string[];
  private redactString: string;

  constructor(options: TOptions = {}) {
    this.name = options.name || 'default';
    this.level = options.level || LogLevel.INFO;
    this.transports = [...this.transports, ...(options.transports || [])];
    this.context = options.context || {};
    this.formatter = options.formatter || new JsonFormatter();
    this.redact = options.redact || [];
    this.redactString = options.redactString || '******';
  }

  trace(message: string, context = {}): void {
    this.log(LogLevel.TRACE, message, context);
  }

  debug(message: string, context = {}): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context = {}): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context = {}): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context = {}): void {
    this.log(LogLevel.ERROR, message, context);
  }

  fatal(message: string, context = {}): void {
    this.log(LogLevel.FATAL, message, context);
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
      this.redacter(key, mergedContext);
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
      redactString: this.redactString,
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
    return level >= this.level;
  }

  private redacter(key: string, context: Record<string, unknown>) {
    const keyPath = key.split('.');

    let current = context;

    for (let i = 0; i < keyPath.length - 1; i++) {
      current = current?.[keyPath[i] ?? ''] as Record<string, unknown>;

      if (current == null || typeof current !== 'object') {
        break;
      }
    }

    const resolvedKey = keyPath[keyPath.length - 1];
    if (!resolvedKey) {
      return;
    }

    if (Object.hasOwn(current, resolvedKey)) {
      current[resolvedKey] = this.redactString;
    }
  }
}
