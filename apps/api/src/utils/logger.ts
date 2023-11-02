import winston from 'winston'
import { Logtail } from '@logtail/node'
import { LogtailTransport } from '@logtail/winston'
import DailyRotateFile from 'winston-daily-rotate-file'

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

const fileTransports: DailyRotateFile[] = ['error', 'all'].map(name => {
  return new DailyRotateFile({
    level: name == 'error' ? 'error' : 'info',
    filename: `logs/${name}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  })
})


const transports = [
  new winston.transports.Console(),
  ...fileTransports,
  process.env.LOGTAIL_SOURCE_TOKEN && new LogtailTransport(new Logtail(process.env.LOGTAIL_SOURCE_TOKEN)),
].filter(Boolean) as winston.transport[]

const logger = winston.createLogger({
  levels,
  transports,
  level: 'debug',
  exitOnError: false,
  format: process.env.NODE_ENV === 'development' ? devFormat : prodFormat,
  exceptionHandlers: [new winston.transports.File({ filename: 'logs/exception.log' })],
  rejectionHandlers: [new winston.transports.File({ filename: 'logs/rejections.log' })],
})

export { logger }
