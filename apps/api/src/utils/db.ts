import { PrismaClient } from 'database'
import { logger } from './logger'

export type QueryEvent = {
  timestamp: Date
  query: string
  params: string
  duration: number
  target: string
}

const db = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
})

db.$on('query', (e: QueryEvent) => {
  logger.info(`Query: ${e.query}`)
  logger.info(`Params: ${e.params}`)
  logger.info(`Duration: ${e.duration}ms`)
})

export default db
