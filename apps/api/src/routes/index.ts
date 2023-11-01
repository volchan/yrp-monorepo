import express from 'express'

import HomeRouter from './homeRouter'
import FlareSolverRouter from './flareSolverRouter'

const AppRouter = express.Router()

AppRouter.use(HomeRouter)
AppRouter.use('/flare_solvers', FlareSolverRouter)

export default AppRouter
