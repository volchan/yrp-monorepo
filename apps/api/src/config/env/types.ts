import { z } from 'zod'

export const appConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'staging', 'test']),
  CORS_ORIGIN: z.string().default('http://[::1]'),
  FLARE_SOLVER_BASE_URL: z.string(),
  PORT: z.string().default('3000'),
  YGG_PASSKEY: z.string(),
})

type AppConfig = z.infer<typeof appConfigSchema>

export type RequiredConfig = Optional<AppConfig, KeysWithFallbackValue>

type KeysWithFallbackValue = 'NODE_ENV' | 'PORT' | 'CORS_ORIGIN'

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
