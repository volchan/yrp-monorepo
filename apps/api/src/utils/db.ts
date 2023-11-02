import { PrismaClient } from '@prisma/client'
import { logger } from '@utils/logger'


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

db.$on('query', e => {
  logger.log('psql', `Query: ${e.query}`)
  logger.log('psql', `Params: ${e.params}`)
  logger.log('psql', `Duration: ${e.duration}ms`)
})

export default db
