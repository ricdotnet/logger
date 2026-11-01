# @ricdotnet/logger

A lightweight, flexible logging library for TypeScript/JavaScript projects with support for custom formatters, transports, and data redaction.

## Features

- 🎯 **Simple API** - Easy to use with sensible defaults
- 📦 **Modular** - Swap formatters and transports to suit your needs
- 🎨 **Multiple Formatters** - JSON and Pretty formatters included
- 📤 **Extensible Transports** - Console transport included, create your own
- 🌳 **Contextual Logging** - Add context that propagates through child loggers
- 🔒 **Data Redaction** - Automatically redact sensitive information from logs
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

The logger provides multiple logging methods for different severity levels:

```typescript
import { Logger } from '@ricdotnet/logger';

const logger = new Logger();

// Log at different levels
logger.trace('Detailed trace information');
logger.debug('Debug information');
logger.info('User logged in');
logger.warn('High memory usage detected');
logger.error('Database connection failed');
logger.fatal('Critical system failure');

// Generic log method with level specification
logger.log(LogLevel.WARN, 'High memory usage detected');
```

### Log Levels

The logger supports the following log levels in order of severity:

- `TRACE` (0) - Low-level debugging information
- `DEBUG` (10) - Detailed debug information
- `INFO` (20) - General informational messages
- `WARN` (30) - Warning messages
- `ERROR` (40) - Error messages
- `FATAL` (50) - Fatal error messages (rarely recoverable)

### Adding Context

You can pass an object as the second argument to add context to your logs:

```typescript
logger.info('User action', {
  userId: 123,
  action: 'profile_update',
  ip: '192.168.1.1'
});
```

### Data Redaction

Automatically redact sensitive information from logs using the `redact` option:

```typescript
import { Logger } from '@ricdotnet/logger';

const logger = new Logger({
  redact: ['password', 'apiKey', 'user.email']
});

logger.info('User registered', {
  userId: 123,
  email: 'user@example.com',
  password: 'super-secret-123'
});

// Output: 
// {
//   "timestamp": "2024-11-01T10:30:45.123Z",
//   "level": "info",
//   "message": "User registered",
//   "context": {
//     "userId": 123,
//     "email": "******",
//     "password": "******"
//   }
// }
```

#### Custom Redaction String

You can customize what gets displayed instead of sensitive data:

```typescript
const logger = new Logger({
  redact: ['password', 'apiKey'],
  redactString: '[REDACTED]'  // Default is '******'
});

logger.info('Login attempt', {
  username: 'john',
  password: 'secret-123'
});

// Output:
// {
//   "username": "john",
//   "password": "[REDACTED]"
// }
```

#### Nested Key Redaction

You can redact nested properties using dot notation:

```typescript
const logger = new Logger({
  redact: ['user.password', 'user.ssn', 'creditCard.number']
});

logger.info('Payment processed', {
  user: {
    id: 123,
    password: 'secret',
    ssn: '123-45-6789'
  },
  creditCard: {
    number: '4111111111111111',
    cvv: '123'
  }
});

// Output redacts:
// - user.password
// - user.ssn
// - creditCard.number
// BUT keeps creditCard.cvv visible (since it's not in redact list)
```

### Configuration

The logger accepts an options object in its constructor:

```typescript
import { Logger, LogLevel, PrettyFormatter } from '@ricdotnet/logger';

const logger = new Logger({
  // Give your logger a name (useful for hierarchical loggers)
  name: 'auth-service',
  
  // Set the minimum log level
  level: LogLevel.DEBUG,

  // Specify custom formatters (defaults to JsonFormatter)
  formatter: new PrettyFormatter(),

  // Add custom transports (defaults to Console transport)
  transports: [
    // Your custom transports here
  ],

  // Add default context that's included in all logs
  context: {
    service: 'api',
    version: '1.0.0'
  },
  
  // Keys to redact from all logs
  redact: ['password', 'apiKey', 'token'],
  
  // String to replace redacted values (default: '******')
  redactString: '***REDACTED***'
});
```

### Available Formatters

#### JsonFormatter (default)

Outputs logs as JSON, perfect for log aggregation services:

```typescript
import { Logger } from '@ricdotnet/logger';

const logger = new Logger();

logger.info('User logged in');
// Output: {"name":"default","timestamp":"2024-11-01T10:30:45.123Z","level":20,"message":"User logged in","context":{}}
```

#### PrettyFormatter

Human-readable format, great for development:

```typescript
import { Logger, PrettyFormatter } from '@ricdotnet/logger';

const logger = new Logger({
  formatter: new PrettyFormatter()
});

logger.info('User logged in', { userId: 123 });
// Output:
// [11/1/2024, 10:30:45 AM] [INFO] User logged in
//   userId=123
```

### Using Transports

Transports determine where logs are written. The default console transport writes to `stdout` for trace/debug/info/warn and `stderr` for error/fatal messages.

#### Console Transport (default)

```typescript
import { Logger, ConsoleTransport } from '@ricdotnet/logger';

const logger = new Logger({
  transports: [new ConsoleTransport()]
});
```

#### Creating Custom Transports

Implement the `Transport` interface to create your own:

```typescript
import { Logger, Transport, LogEntry } from '@ricdotnet/logger';
import fs from 'fs';

class FileTransport implements Transport {
  constructor(private filepath: string) {}

  write(entry: LogEntry, formatted: string): void {
    fs.appendFileSync(this.filepath, formatted + '\n');
  }

  close(): void {
    // Cleanup if needed
  }
}

const logger = new Logger({
  transports: [
    new ConsoleTransport(),
    new FileTransport('./logs/app.log')
  ]
});
```

### Child Loggers

Create child loggers that inherit configuration and context from their parent. Child loggers have hierarchical names:

```typescript
const logger = new Logger({
  name: 'api',
  context: { service: 'api' },
  redact: ['password', 'token']
});

// Child logger inherits parent settings
const authLogger = logger.child('auth', {
  module: 'authentication'
});

// Logger name becomes: 'api.auth'
authLogger.info('User authenticated');
// Logs include: 
// {
//   "name": "api.auth",
//   "service": "api",
//   "module": "authentication",
//   ...
// }
```

This is useful for:
- Associating logs with specific requests/operations
- Organizing logs by component or module
- Inheriting sensitive field redaction rules from parent loggers

## Complete Example

```typescript
import { 
  Logger, 
  LogLevel,
  PrettyFormatter, 
  type LogEntry,
  ConsoleTransport
} from '@ricdotnet/logger';
import fs from 'fs';

// Create a custom file transport
class FileTransport implements Transport {
  constructor(private filepath: string) {}

  write(entry: LogEntry, formatted: string): void {
    fs.appendFileSync(this.filepath, formatted + '\n');
  }
  
  close(): void {
    // Cleanup
  }
}

// Initialize logger
const logger = new Logger({
  name: 'app',
  level: LogLevel.DEBUG,
  formatter: new PrettyFormatter(),
  transports: [
    new ConsoleTransport(),
    new FileTransport('./logs/app.log')
  ],
  context: {
    app: 'my-app',
    environment: process.env.NODE_ENV
  },
  redact: ['password', 'apiKey', 'user.ssn']
});

// Use in your application
const authLogger = logger.child('auth');
authLogger.info('Processing user registration', { email: 'user@example.com' });

try {
  // Some operation
} catch (error) {
  authLogger.error('Registration failed', { 
    error: error.message,
    password: 'secret123'  // Will be redacted
  });
}
```

## API Reference

### Logger

#### Constructor

```typescript
constructor(options?: {
  name?: string;
  level?: LogLevel;
  formatter?: Formatter;
  transports?: Transport[];
  context?: Record<string, unknown>;
  redact?: string[];
  redactString?: string;
})
```

#### Methods

- `trace(message: string, context?: Record<string, unknown>): void` - Log at trace level
- `debug(message: string, context?: Record<string, unknown>): void` - Log at debug level
- `info(message: string, context?: Record<string, unknown>): void` - Log at info level
- `warn(message: string, context?: Record<string, unknown>): void` - Log at warn level
- `error(message: string, context?: Record<string, unknown>): void` - Log at error level
- `fatal(message: string, context?: Record<string, unknown>): void` - Log at fatal level
- `log(level: LogLevel, message: string, context?: Record<string, unknown>): void` - Generic log method
- `child(name: string, context?: Record<string, unknown>): Logger` - Create a child logger with inherited settings

### Exports

```typescript
import {
  Logger,              // Main logger class
  LogLevel,            // LogLevel enum with TRACE, DEBUG, INFO, WARN, ERROR, FATAL
  PrettyFormatter,     // Human-readable formatter
  JsonFormatter,       // JSON formatter
  ConsoleTransport,    // Console transport
  // Types
  type LogEntry,
  type Formatter,
  type Transport,
} from '@ricdotnet/logger';
```

### Types

#### LogLevel

```typescript
enum LogLevel {
  TRACE = 0,
  DEBUG = 10,
  INFO = 20,
  WARN = 30,
  ERROR = 40,
  FATAL = 50
}
```

#### LogEntry

```typescript
interface LogEntry {
  name: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  context: Record<string, unknown>;
}
```

#### Formatter

```typescript
interface Formatter {
  format(entry: LogEntry): string;
}
```

#### Transport

```typescript
interface Transport {
  write(entry: LogEntry, formatted: string): void | Promise<void>;
  close?(): void | Promise<void>;
}
```

## TypeScript Support

All types are exported from the main package entry point:

```typescript
import type { 
  LogEntry,     // The log entry object
  LogLevel,     // LogLevel enum type
  Formatter,    // Formatter interface
  Transport     // Transport interface
} from '@ricdotnet/logger';
```

## License

ISC

## Author

ricdotnet - [ricr.dev](https://ricr.dev)
