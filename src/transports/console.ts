import { LogEntry, LogLevel, Transport } from '../types';

export class ConsoleTransport implements Transport {
  write(entry: LogEntry, formatted: string): void {
    const output =
      entry.level === LogLevel.ERROR || entry.level === LogLevel.FATAL
        ? process.stderr
        : process.stdout;

    output.write(`${formatted}\n`);
  }

  close?(): void | Promise<void> {
    throw new Error('Method not implemented.');
  }
}
