import type { Formatter, LogEntry } from '../types';

export class JsonFormatter implements Formatter {
  format(entry: LogEntry): string {
    return JSON.stringify(entry);
  }
}
