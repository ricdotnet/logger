export enum Constants {
  RESET        = '\x1b[0m',
  BRIGHT       = '\x1b[1m',
  DIM          = '\x1b[2m',
  UNDERSCORE   = '\x1b[4m',
  BLINK        = '\x1b[5m',
  REVERSE      = '\x1b[7m',
  HIDDEN       = '\x1b[8m',

  TEXT_BLACK   = '\x1b[30m',
  TEXT_RED     = '\x1b[31m',
  TEXT_GREEN   = '\x1b[32m',
  TEXT_YELLOW  = '\x1b[33m',
  TEXT_BLUE    = '\x1b[34m',
  TEXT_MAGENTA = '\x1b[35m',
  TEXT_CYAN    = '\x1b[36m',
  TEXT_WHITE   = '\x1b[37m',

  BG_BLACK     = '\x1b[40m',
  BG_RED       = '\x1b[41m',
  BG_GREEN     = '\x1b[42m',
  BG_YELLOW    = '\x1b[43m',
  BG_BLUE      = '\x1b[44m',
  BG_MAGENTA   = '\x1b[45m',
  BG_CYAN      = '\x1b[46m',
  BG_WHITE     = '\x1b[47m',
}

export enum LogLevels {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}
