import { vi, expect, describe, test } from 'vitest';
import { Logger } from '../src';
import { ConsoleTransport } from '../src/transports/console';
import { JsonFormatter } from '../src/formatters/json';
import { PrettyFormatter } from '../src/formatters/pretty';

describe('logger', () => {
  test('creates a logger with default properties if none are given', () => {
    const logger = new Logger();

    expect(logger._name).toBe('default');
    expect(logger._level).toBe('info');
    expect(logger._transports[0]).toBeInstanceOf(ConsoleTransport);
    expect(Object.keys(logger._context)).toHaveLength(0);
    expect(logger._formatter).toBeInstanceOf(JsonFormatter);
    expect(logger._redact).toHaveLength(0);
  });

  test('creates a logger with the given options', () => {
    const logger = new Logger({
      level: 'debug',
      name: 'test',
      transports: [new ConsoleTransport()],
      context: { foo: 'bar' },
      formatter: new PrettyFormatter(),
      redact: ['password'],
    });

    expect(logger._name).toBe('test');
    expect(logger._level).toBe('debug');
    expect(logger._transports[0]).toBeInstanceOf(ConsoleTransport);
    expect(logger._context).toEqual({ foo: 'bar' });
    expect(logger._formatter).toBeInstanceOf(PrettyFormatter);
    expect(logger._redact).toEqual(['password']);
  });

  test('redacts the values with keys matching the redact array', () => {
    const logger = new Logger({
      name: 'Redacter',
      redact: ['password'],
    });

    const formatSpy = vi.spyOn(logger._formatter, 'format');
    logger.info('Hello, world!', { password: '<PASSWORD>', foo: 'bar' });

    expect(formatSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Redacter',
        message: 'Hello, world!',
        password: '******',
        foo: 'bar',
      }),
    );
  });
});
