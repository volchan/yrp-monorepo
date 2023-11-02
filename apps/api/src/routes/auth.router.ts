import express from 'express'

import {
  loginUserHandler,
  logoutUserHandler,
  refreshAccessTokenHandler,
  registerUserHandler,
} from '@controllers/auth.controller'
import { deserializeUser } from '@middlewares/deserialize-user.middleware'
import { requireUser } from '@middlewares/require-user.middleware'
import { validate } from '@middlewares/validate.middleware'
import { loginUserSchema, createUserSchema } from '@schemas/user.schema'

const AuthRouter = express.Router()

AuthRouter.post('/sign_up', validate(createUserSchema), registerUserHandler)
AuthRouter.post('/sign_in', validate(loginUserSchema), loginUserHandler)
AuthRouter.get('/refresh', refreshAccessTokenHandler)
AuthRouter.delete('/sign_out', deserializeUser, requireUser, logoutUserHandler)

export default AuthRouter
