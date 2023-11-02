import express from 'express'
import { getMeHandler, updateUserHandler } from '@controllers/users.controller'
import { deserializeUser } from '@middlewares/deserialize-user.middleware'
import { requireUser } from '@middlewares/require-user.middleware'

const UserRouter = express.Router()

UserRouter.use(deserializeUser, requireUser)

UserRouter.get('/me', getMeHandler)
UserRouter.put('/update', updateUserHandler)
UserRouter.patch('/update', updateUserHandler)

export default UserRouter
