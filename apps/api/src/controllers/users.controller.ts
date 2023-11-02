import { NextFunction, Request, Response } from 'express'

import AppError from '@utils/app-error'
import { findUniqueUser, updateUser } from '@services/user.service'
import { generateHashedPassword, validatePassword } from '@utils/bcrypt'
import UserDTO from '@dtos/user.dto'

const userDTO = new UserDTO()

export const getMeHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res
      .status(200)
      .status(200)
      .json({
        status: 'success',
        data: {
          user: userDTO.toJson(res.locals.user),
        },
      })
  } catch (err: any) {
    next(err)
  }
}

export const updateUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, passwordConfirm, ygg_passkey } = req.body
    const user = await findUniqueUser(
      { email: email.toLowerCase() },
      { id: true, email: true, passwordHash: true, ygg_passkey: true },
    )

    if (!user) {
      return next(new AppError(400, 'Invalid email or password'))
    }

    if (password && passwordConfirm && password !== passwordConfirm) {
      return next(new AppError(400, 'Passwords do not match'))
    }

    const newPassword =
      password && !validatePassword(password, user.passwordHash)
        ? await generateHashedPassword(password)
        : user.passwordHash

    const updateInput = {
      email,
      passwordHash: newPassword,
      ygg_passkey,
    }

    const updatedUser = await updateUser({ id: user.id }, updateInput)
    res.status(200).json({
      status: 'success',
      data: {
        user: userDTO.toJson(updatedUser),
      },
    })
  } catch (err: any) {
    next(err)
  }
}
