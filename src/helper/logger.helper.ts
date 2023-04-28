import { config, createLogger, format, transports } from 'winston';

export const logger = createLogger({
  levels: config.syslog.levels,
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp} ${level}: ${message}]`;
    }),
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: `data/logs/log.log`,
    }),
  ],
});
