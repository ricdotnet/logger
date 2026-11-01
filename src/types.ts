export enum LogLevel {
  TRACE = 0,
  DEBUG = 10,
  INFO = 20,
  WARN = 30,
  ERROR = 40,
  FATAL = 50,
}

export const LogLevelNames: string[] = [
  'TRACE',
  'DEBUG',
  'INFO',
  'WARN',
  'ERROR',
  'FATAL',
];

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

export interface Formatter {
  format(entry: LogEntry): string;
}

export interface Transport {
  write(entry: LogEntry, formatted: string): void | Promise<void>;
  close?(): void | Promise<void>;
}
