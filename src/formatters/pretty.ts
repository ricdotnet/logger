import { LogLevelNames, type Formatter, type LogEntry } from '../types';

export class PrettyFormatter implements Formatter {
  private indent = 2;

  format(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toLocaleString();

    const context = this.unwrapContext(entry.context ?? {}).join('\n');

    return `[${timestamp}] [${LogLevelNames[entry.level]}] ${entry.message}\n${context}`;
  }

  private unwrapContext(
    context: Record<string, unknown>,
    unwrapped: string[] = [],
    level = 1,
  ): string[] {
    for (const key in context) {
      if (typeof context[key] === 'object') {
        unwrapped.push(`${'  '.repeat(level * this.indent)}${key}`);

        this.unwrapContext(
          context[key] as Record<string, unknown>,
          unwrapped,
          level + 1,
        );

        continue;
      }

      unwrapped.push(
        `${'  '.repeat(level * this.indent)}${key}=${context[key]}`,
      );
    }

    return unwrapped;
  }
}
