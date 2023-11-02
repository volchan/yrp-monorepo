import { z } from 'zod'

const isValidPort = (val: string, ctx: z.RefinementCtx) => {
  const parsed = parseInt(val)
  if (isNaN(parsed)) {
    const message = val === undefined ? 'is missing' : 'must be a number'
    
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message,
    })

    return z.NEVER
  }
  return parsed
}

export const appConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'staging', 'test']),
  PORT: z.string().transform((val, ctx) => isValidPort(val, ctx)),
  FLARE_SOLVER_BASE_URL: z.string().url(),
  YGG_PASSKEY: z.string(),
  DATABASE_URL: z.string().url(),
})
