enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, data } = entry;
    const dataStr = data ? ` | ${JSON.stringify(data)}` : "";
    return `[${timestamp}] ${level}: ${message}${dataStr}`;
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Always log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(this.formatLog(entry));
    }
  }

  debug(message: string, data?: Record<string, unknown>): void {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.DEBUG,
      message,
      data,
    });
  }

  info(message: string, data?: Record<string, unknown>): void {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message,
      data,
    });
  }

  warn(message: string, data?: Record<string, unknown>): void {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      message,
      data,
    });
  }

  error(message: string, error?: Error, data?: Record<string, unknown>): void {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      message,
      data,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    });
  }

  getLogs(filter?: { level?: LogLevel; limit?: number }): LogEntry[] {
    let filtered = [...this.logs];

    if (filter?.level) {
      filtered = filtered.filter((log) => log.level === filter.level);
    }

    if (filter?.limit) {
      filtered = filtered.slice(-filter.limit);
    }

    return filtered;
  }

  clear(): void {
    this.logs = [];
  }
}

export const logger = new Logger();
