import express from 'express'

import HomeRouter from './home.router'
import FlareSolverRouter from './flare-solver.router'
import AuthRouter from './auth.router'
import UserRouter from './user.router'

const AppRouter = express.Router()

AppRouter.use(HomeRouter)
AppRouter.use('/auth', AuthRouter)
AppRouter.use('/flare_solvers', FlareSolverRouter)
AppRouter.use('/users', UserRouter)

export default AppRouter
