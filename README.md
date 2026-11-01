# @ricdotnet/logger

A lightweight, flexible logging library for TypeScript/JavaScript projects with support for custom formatters and transports.

## Features

- 🎯 **Simple API** - Easy to use with sensible defaults
- 📦 **Modular** - Swap formatters and transports to suit your needs
- 🎨 **Multiple Formatters** - JSON and Pretty formatters included
- 📤 **Extensible Transports** - Console transport included, create your own
- 🌳 **Contextual Logging** - Add context that propagates through child loggers
- 📝 **Full TypeScript Support** - Built with TypeScript for type safety

## Installation

```bash
npm install @ricdotnet/logger
```

## Quick Start

```typescript
import { Logger } from '@ricdotnet/logger';

const logger = new Logger();

logger.info('Application started');
logger.error('Something went wrong!');
```

## Usage

### Basic Logging

The logger provides two main methods for logging:

```typescript
import { Logger } from '@ricdotnet/logger';

const logger = new Logger();

// Log at info level
logger.info('User logged in');

// Log at error level
logger.error('Database connection failed');

// Generic log method with level specification
logger.log('warn', 'High memory usage detected');
```

### Log Levels

The logger supports the following log levels:

- `debug` - Detailed debug information
- `info` - General informational messages
- `warn` - Warning messages
- `error` - Error messages
- `fatal` - Fatal error messages (rarely recoverable)

### Adding Context

You can pass an object as the second argument to add context to your logs:

```typescript
logger.info('User action', {
  userId: 123,
  action: 'profile_update',
  ip: '192.168.1.1',
});
```

### Configuration

The logger accepts an options object in its constructor:

```typescript
import { Logger } from '@ricdotnet/logger';
import { PrettyFormatter } from '@ricdotnet/logger';

const logger = new Logger({
  // Set the minimum log level
  level: 'debug',

  // Specify custom formatters (defaults to JsonFormatter)
  formatter: new PrettyFormatter(),

  // Add custom transports (defaults to Console transport)
  transports: [
    // Your custom transports here
  ],

  // Add default context that's included in all logs
  context: {
    service: 'api',
    version: '1.0.0',
  },
});
```

### Available Formatters

#### JsonFormatter (default)

Outputs logs as JSON, perfect for log aggregation services:

```typescript
import { Logger } from '@ricdotnet/logger';

const logger = new Logger();
// Output: {"timestamp":"2024-11-01T10:30:45.123Z","level":"info","message":"User logged in"}
```

#### PrettyFormatter

Human-readable format, great for development:

```typescript
import { Logger, PrettyFormatter } from '@ricdotnet/logger';

const logger = new Logger({
  formatter: new PrettyFormatter(),
});

logger.info('User logged in', { userId: 123 });
// Output: [11/1/2024, 10:30:45 AM] [INFO] User logged in {"userId":123}
```

### Using Transports

Transports determine where logs are written. The default console transport writes to `stdout` for info/debug/warn and `stderr` for error/fatal messages.

#### Console Transport (default)

```typescript
import { Logger, ConsoleTransport } from '@ricdotnet/logger';

const logger = new Logger({
  transports: [new ConsoleTransport()],
});
```

#### Creating Custom Transports

Implement the `Transport` interface to create your own:

```typescript
import { Logger, Transport, LogEntry } from '@ricdotnet/logger';

class FileTransport implements Transport {
  constructor(private filepath: string) {}

  write(entry: LogEntry, formatted: string): void {
    // Write to file
    fs.appendFileSync(this.filepath, formatted + '\n');
  }

  close(): void {
    // Cleanup if needed
  }
}

const logger = new Logger({
  transports: [new ConsoleTransport(), new FileTransport('./logs/app.log')],
});
```

### Child Loggers

Create child loggers that inherit configuration and context from their parent:

```typescript
const logger = new Logger({
  context: { service: 'api' },
});

// Child logger inherits parent context
const requestLogger = logger.child({
  requestId: 'abc-123',
  userId: 456,
});

requestLogger.info('Request received');
// Logs include: { service: 'api', requestId: 'abc-123', userId: 456, ... }
```

This is useful for associating logs with specific requests, operations, or components.

## Complete Example

```typescript
import { Logger, PrettyFormatter, type LogEntry } from '@ricdotnet/logger';

// Create a custom file transport
class FileTransport {
  constructor(private filepath: string) {}

  write(entry: LogEntry, formatted: string): void {
    // Implementation here
  }
}

// Initialize logger
const logger = new Logger({
  level: 'debug',
  formatter: new PrettyFormatter(),
  transports: [new FileTransport('./logs/app.log')],
  context: {
    app: 'my-app',
    environment: process.env.NODE_ENV,
  },
});

// Use in your application
const userLogger = logger.child({ module: 'users' });
userLogger.info('Processing user registration', { email: 'user@example.com' });

try {
  // Some operation
} catch (error) {
  userLogger.error('Registration failed', { error: error.message });
}
```

## API Reference

### Logger

#### Constructor

```typescript
constructor(options?: {
  level?: 'debug' | 'info' | 'warn' | 'error';
  formatter?: Formatter;
  transports?: Transport[];
  context?: Record<string, unknown>;
})
```

#### Methods

- `info(message: string, context?: Record<string, unknown>): void` - Log at info level
- `error(message: string, context?: Record<string, unknown>): void` - Log at error level
- `log(level: TLevel, message: string, context?: Record<string, unknown>): void` - Generic log method
- `child(context?: Record<string, unknown>): Logger` - Create a child logger with inherited context

### Exports

```typescript
import {
  Logger, // Main logger class
  PrettyFormatter, // Human-readable formatter
  JsonFormatter, // JSON formatter
  ConsoleTransport, // Console transport
  // Types
  type LogEntry,
  type LogLevel,
  type Formatter,
  type Transport,
  type TLevel,
} from '@ricdotnet/logger';
```

## TypeScript Support

All types are exported from the main package entry point:

```typescript
import type {
  LogEntry, // The log entry object
  LogLevel, // Union type of all levels
  Formatter, // Transport interface
  Transport, // Transport interface
} from '@ricdotnet/logger';
```

## License

ISC

## Author

ricdotnet - [ricr.dev](https://ricr.dev)
