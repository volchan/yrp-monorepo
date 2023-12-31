import { CookieOptions, NextFunction, Request, Response } from 'express'

import config from '@config/redis'
import AppError from '@utils/app-error'
import { Prisma } from '@prisma/client'
import redisClient from '@utils/connect-redis'
import { signJwt, verifyJwt } from '@utils/jwt'
import { LoginUserInput, CreateUserInput } from '@schemas/user.schema'
import { createUser, findUniqueUser, signTokens } from '@services/user.service'
import { generateHashedPassword, generateVerificationCode, validatePassword } from '@utils/bcrypt'
import UserDTO from '@dtos/user.dto'

const userDTO = new UserDTO()

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
}

if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true

const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(Date.now() + config.accessTokenExpiresIn * 60 * 1000),
  maxAge: config.accessTokenExpiresIn * 60 * 1000,
}

const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(Date.now() + config.refreshTokenExpiresIn * 60 * 1000),
  maxAge: config.refreshTokenExpiresIn * 60 * 1000,
}

export const registerUserHandler = async (req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction) => {
  try {
    const user = await createUser({
      email: req.body.email.toLowerCase(),
      passwordHash: await generateHashedPassword(req.body.password),
      verificationCode: generateVerificationCode(),
    })

    res.status(201).json({
      status: 'success',
      data: {
        user: userDTO.toJson(user),
      },
    })
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        return res.status(409).json({
          status: 'fail',
          message: 'Email already exist, please use another email address',
        })
      }
    }
    next(err)
  }
}

export const loginUserHandler = async (req: Request<{}, {}, LoginUserInput>, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    const user = await findUniqueUser(
      { email: email.toLowerCase() },
      { id: true, email: true, verified: true, passwordHash: true },
    )

    if (!user || !(await validatePassword(password, user.passwordHash))) {
      return next(new AppError(400, 'Invalid email or password'))
    }

    // Sign Tokens
    const { access_token, refresh_token } = await signTokens(user)
    res.cookie('access_token', access_token, accessTokenCookieOptions)
    res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions)
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    })

    res.status(200).json({
      status: 'success',
      access_token,
    })
  } catch (err: any) {
    next(err)
  }
}

export const refreshAccessTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refresh_token = req.cookies.refresh_token

    const message = 'Could not refresh access token'

    if (!refresh_token) {
      return next(new AppError(403, message))
    }

    // Validate refresh token
    const decoded = verifyJwt<{ sub: string }>(refresh_token, 'JWT_REFRESH_TOKEN_PUBLIC_KEY')

    if (!decoded) {
      return next(new AppError(403, message))
    }

    // Check if user has a valid session
    const session = await redisClient.get(decoded.sub)

    if (!session) {
      return next(new AppError(403, message))
    }

    // Check if user still exist
    const user = await findUniqueUser({ id: JSON.parse(session).id })

    if (!user) {
      return next(new AppError(403, message))
    }

    // Sign new access token
    const access_token = signJwt({ sub: user.id }, 'JWT_ACCESS_TOKEN_PRIVATE_KEY', {
      expiresIn: `${config.accessTokenExpiresIn}m`,
    })

    // 4. Add Cookies
    res.cookie('access_token', access_token, accessTokenCookieOptions)
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    })

    // 5. Send response
    res.status(200).json({
      status: 'success',
      access_token,
    })
  } catch (err: any) {
    next(err)
  }
}

function logout(res: Response) {
  res.cookie('access_token', '', { maxAge: -1 })
  res.cookie('refresh_token', '', { maxAge: -1 })
  res.cookie('logged_in', '', { maxAge: -1 })
}

export const logoutUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await redisClient.del(res.locals.user.id)
    logout(res)

    res.status(200).json({
      status: 'success',
    })
  } catch (err: any) {
    next(err)
  }
}
