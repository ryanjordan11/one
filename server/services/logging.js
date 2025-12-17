import { writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

class LoggingServiceClass {
  constructor() {
    this.logsDir = join(process.cwd(), 'logs');
    this.ensureLogsDirectory();
  }

  ensureLogsDirectory() {
    if (!existsSync(this.logsDir)) {
      mkdirSync(this.logsDir, { recursive: true });
    }
  }

  logRequest(req) {
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get('user-agent')
    };
    console.log(`[${log.timestamp}] ${log.method} ${log.path}`);
  }

  logError(error, req) {
    const log = {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      method: req?.method,
      path: req?.path,
      ip: req?.ip
    };
    console.error(`[ERROR] [${log.timestamp}] ${error.message}`);
  }

  logActivity(userId, action, details) {
    const log = {
      timestamp: new Date().toISOString(),
      userId,
      action,
      details
    };
    console.log(`[ACTIVITY] ${userId}: ${action}`);
  }
}

export const LoggingService = new LoggingServiceClass();
