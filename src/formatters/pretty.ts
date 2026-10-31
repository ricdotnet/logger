import type { Formatter, LogEntry } from '../types';

export class PrettyFormatter implements Formatter {
  format(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toLocaleString();

    const context = entry.context ? JSON.stringify(entry.context) : '';

    return `[${timestamp}] [${entry.level.toUpperCase()}] ${entry.message} ${context}`;
  }
}
