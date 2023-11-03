import express from 'express'

import homeController from '../controllers/home.controller'

const HomeRouter = express.Router()

HomeRouter.get('/health', homeController.health)

export default HomeRouter
