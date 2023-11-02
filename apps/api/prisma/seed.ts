import { logger } from '@utils/logger'
import db from '@utils/db'

async function main() {
  logger.info('🌱 Seeding database...')

  const alice = await db.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      passwordHash: 'password'
    },
  })

  const bob = await db.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      passwordHash: 'password'
    },
  })
  console.log({ alice, bob })

  logger.info('✅ Database successfully seeded')
}
main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })
