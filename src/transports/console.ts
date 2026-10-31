import { LogEntry, Transport } from '../types';

export class Console implements Transport {
  write(entry: LogEntry, formatted: string): void {
    const output =
      entry.level === 'error' || entry.level === 'fatal'
        ? process.stderr
        : process.stdout;

    output.write(`${formatted}\n`);
  }

  close?(): void | Promise<void> {
    throw new Error('Method not implemented.');
  }
}
