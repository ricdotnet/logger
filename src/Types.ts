export type Primitives = string | number | object;
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface ILogger {
    directory?: string;
    logToConsole?: boolean;
    logToFile?: boolean;
    level?: LogLevel;
}
