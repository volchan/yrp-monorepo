import jwt, { SignOptions } from 'jsonwebtoken'

import { appEnv } from '@config/env'

export const signJwt = (
  payload: Object,
  keyName: 'JWT_ACCESS_TOKEN_PRIVATE_KEY' | 'JWT_REFRESH_TOKEN_PRIVATE_KEY',
  options: SignOptions,
) => {
  const privateKey = Buffer.from(appEnv[keyName], 'base64').toString('utf8')
  return jwt.sign(payload, privateKey, {
    ...options,
    algorithm: 'RS256',
  })
}

export const verifyJwt = <T>(
  token: string,
  keyName: 'JWT_ACCESS_TOKEN_PUBLIC_KEY' | 'JWT_REFRESH_TOKEN_PUBLIC_KEY',
): T | null => {
  try {
    const publicKey = Buffer.from(appEnv[keyName], 'base64').toString('utf8')
    const decoded = jwt.verify(token, publicKey) as T

    return decoded
  } catch (error) {
    return null
  }
}
