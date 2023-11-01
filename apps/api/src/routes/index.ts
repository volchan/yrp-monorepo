import express from 'express'

import HomeRouter from './home.router'
import FlareSolverRouter from './flare-solver.router'

const AppRouter = express.Router()

AppRouter.use(HomeRouter)
AppRouter.use('/flare_solvers', FlareSolverRouter)

export default AppRouter
