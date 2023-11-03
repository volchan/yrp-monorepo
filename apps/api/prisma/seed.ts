import { logger } from '@utils/logger'
import db from '@utils/db'
import { generateHashedPassword } from '@utils/bcrypt'

async function main() {
  logger.info('🌱 Seeding database...')

  await db.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      passwordHash: await generateHashedPassword('password'),
    },
  })

  await db.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      passwordHash: await generateHashedPassword('password'),
    },
  })

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
