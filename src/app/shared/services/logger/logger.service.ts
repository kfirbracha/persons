import { Injectable } from '@angular/core';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  component: string;
  line: string;
  message: string | object;
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m',

    fg: {
      black: '\x1b[30m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m',
      crimson: '\x1b[38m',
    },

    bg: {
      black: '\x1b[40m',
      red: '\x1b[41m',
      green: '\x1b[42m',
      yellow: '\x1b[43m',
      blue: '\x1b[44m',
      magenta: '\x1b[45m',
      cyan: '\x1b[46m',
      white: '\x1b[47m',
      crimson: '\x1b[48m',
    },
  };

  private logEntry(level: LogLevel, message: string | object) {
    const stack = new Error().stack;
    const caller = this.parseStack(stack);

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      component: caller.component,
      line: caller.line,
      message,
    };

    console.log(this.formatLogEntry(entry));
  }
  private parseStack(stack: string | undefined): {
    component: string;
    line: string;
  } {
    if (!stack) return { component: 'Unknown', line: 'Unknown' };

    const stackLines = stack.split('\n');

    const relevantLine = stackLines[3];

    if (!relevantLine) return { component: 'Unknown', line: 'Unknown' };

    const match = relevantLine.match(/at (.+?) \((.+):(\d+):(\d+)\)/);

    if (match) {
      const [, fullComponent, file, line] = match;
      const componentParts = fullComponent.split('_');
      const component = componentParts[componentParts.length - 1];

      return { component, line };
    }

    return { component: 'Unknown', line: 'Unknown' };
  }
  private formatLogEntry(entry: LogEntry): string {
    const { timestamp, level, component, line, message } = entry;
    const formattedMessage =
      typeof message === 'string' ? message : JSON.stringify(message);

    let color: string;
    switch (level) {
      case 'INFO':
        color = this.colors.fg.green;
        break;
      case 'WARN':
        color = this.colors.fg.yellow;
        break;
      case 'ERROR':
        color = this.colors.fg.red;
        break;
      case 'DEBUG':
        color = this.colors.fg.blue;
        break;
      default:
        color = this.colors.reset;
    }

    return `${color}${timestamp} [${level}] [Location - ${component}]  [Line - ${line}] : ${this.colors.reset}${formattedMessage}`;
  }

  info(message: string | object) {
    this.logEntry('INFO', message);
  }

  warn(message: string | object) {
    this.logEntry('WARN', message);
  }

  error(message: string | object) {
    this.logEntry('ERROR', message);
  }

  debug(message: string | object) {
    this.logEntry('DEBUG', message);
  }
}
