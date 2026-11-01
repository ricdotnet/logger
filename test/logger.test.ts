import { vi, expect, describe, test } from 'vitest';
import { Logger, LogLevel } from '../src';
import { ConsoleTransport } from '../src/transports/console';
import { JsonFormatter } from '../src/formatters/json';
import { PrettyFormatter } from '../src/formatters/pretty';

describe('logger', () => {
  test('creates a logger with default properties if none are given', () => {
    const logger = new Logger();

    expect(logger._name).toBe('default');
    expect(logger._level).toBe(LogLevel.INFO);
    expect(logger._transports[0]).toBeInstanceOf(ConsoleTransport);
    expect(Object.keys(logger._context)).toHaveLength(0);
    expect(logger._formatter).toBeInstanceOf(JsonFormatter);
    expect(logger._redact).toHaveLength(0);
  });

  test('creates a logger with the given options', () => {
    const logger = new Logger({
      level: LogLevel.DEBUG,
      name: 'test',
      transports: [new ConsoleTransport()],
      context: { foo: 'bar' },
      formatter: new PrettyFormatter(),
      redact: ['password'],
    });

    expect(logger._name).toBe('test');
    expect(logger._level).toBe(LogLevel.DEBUG);
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
        context: {
          password: '******',
          foo: 'bar',
        },
      }),
    );
  });

  test('redacts nested values with keys matching the target path', () => {
    const logger = new Logger({
      name: 'Redacter',
      redact: [
        'user.password',
        'user.nested.password',
        'user.nested.other.password',
      ],
    });

    const formatSpy = vi.spyOn(logger._formatter, 'format');
    logger.info('Hello, world!', {
      user: {
        password: '<PASSWORD>',
        foo: 'bar',
        nested: {
          password: '<PASSWORD>',
          other: {
            password: '<PASSWORD>',
          },
        },
      },
    });

    expect(formatSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        context: {
          user: {
            password: '******',
            foo: 'bar',
            nested: { password: '******', other: { password: '******' } },
          },
        },
      }),
    );
  });

  test('redacts target values but keeps the original context untouched', () => {
    const logger = new Logger({
      name: 'Redacter',
      redact: ['password'],
    });

    const context = { password: '<PASSWORD>', foo: 'bar' };

    const formatSpy = vi.spyOn(logger._formatter, 'format');
    logger.info('Hello, world!', context);

    expect(formatSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Redacter',
        message: 'Hello, world!',
        context: {
          password: '******',
          foo: 'bar',
        },
      }),
    );
    expect(context).toEqual({ password: '<PASSWORD>', foo: 'bar' });
  });

  test('logs if levels are higher than the level set', () => {
    const logger = new Logger({
      level: LogLevel.INFO,
    });

    const writeSpy = vi.spyOn(logger._transports[0], 'write');
    logger.debug('Does not log a debug log');
    logger.error('Logs an info log');
    logger.error('Logs an error log');

    expect(writeSpy).toHaveBeenCalledTimes(2);
  });
});
