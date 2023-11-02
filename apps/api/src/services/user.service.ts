import { Prisma, User } from '@prisma/client'

import db from '@utils/db'
import config from '@config/redis'
import { signJwt } from '@utils/jwt'
import redisClient from '@utils/connect-redis'

export const excludedFields = ['password', 'verified', 'verificationCode']

export const createUser = async (input: Prisma.UserCreateInput) => {
  return (await db.user.create({
    data: input,
  })) as User
}

export const findUniqueUser = async (where: Prisma.UserWhereUniqueInput, select?: Prisma.UserSelect) => {
  return (await db.user.findUnique({
    where,
    select,
  })) as User
}

export const signTokens = async (user: Prisma.UserCreateInput) => {
  // 1. Create Session
  redisClient.set(`${user.id}`, JSON.stringify(user), {
    EX: config.redisCacheExpiresIn * 60,
  })

  // 2. Create Access and Refresh tokens
  const access_token = signJwt({ sub: user.id }, 'JWT_ACCESS_TOKEN_PRIVATE_KEY', {
    expiresIn: `${config.accessTokenExpiresIn}m`,
  })

  const refresh_token = signJwt({ sub: user.id }, 'JWT_REFRESH_TOKEN_PRIVATE_KEY', {
    expiresIn: `${config.refreshTokenExpiresIn}m`,
  })

  return { access_token, refresh_token }
}
