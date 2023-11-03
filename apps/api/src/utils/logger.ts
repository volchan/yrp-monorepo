import winston from 'winston'
import { Logtail } from '@logtail/node'
import { LogtailTransport } from '@logtail/winston'

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
  psql: 5,
}

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  http: 'magenta',
  psql: 'green',
  debug: 'blue',
}

winston.addColors(colors)

const devFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize(),
  winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`),
)

const prodFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.json(),
)

const transports = [
  new winston.transports.Console(),
  process.env.LOGTAIL_SOURCE_TOKEN && new LogtailTransport(new Logtail(process.env.LOGTAIL_SOURCE_TOKEN)),
].filter(Boolean) as winston.transport[]

const logger = winston.createLogger({
  levels,
  transports,
  level: 'debug',
  exitOnError: false,
  format: process.env.NODE_ENV === 'development' ? devFormat : prodFormat,
})

export { logger }
