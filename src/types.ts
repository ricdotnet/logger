export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

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
