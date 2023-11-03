import express from 'express'

import { requireUser } from '../middlewares/require-user.middleware'
import { deserializeUser } from '../middlewares/deserialize-user.middleware'
import { getMeHandler, updateUserHandler } from '../controllers/users.controller'

const UserRouter = express.Router()

UserRouter.use(deserializeUser, requireUser)

UserRouter.get('/me', getMeHandler)
UserRouter.put('/update', updateUserHandler)
UserRouter.patch('/update', updateUserHandler)

export default UserRouter
