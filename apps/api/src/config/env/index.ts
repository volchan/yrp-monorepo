import { logger } from '@utils/logger'
import { appConfigSchema } from './types'

const loadEnv = () => {
  logger.info('🔄 Loading environment variables')
  const parsedEnv = appConfigSchema.safeParse(process.env)
  
  logger.info('🔍 Checking required environment variables')
  if (!parsedEnv.success) {
    const errorMessage = `❌ Missing required environment variables:
            ${parsedEnv.error.issues.map(issue => `- ${issue.path[0]}`).join('\n            ')}
    `
    logger.error(errorMessage)
    process.exit(1)
  }

  logger.info('✅ Environment variables loaded')
  return parsedEnv.data
}

export const appEnv = loadEnv()
