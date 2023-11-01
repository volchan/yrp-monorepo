// import axios from 'axios'
import helmet from 'helmet'
import express, { json, urlencoded } from 'express'
import cors from 'cors'
// import { parse as pttParse, DefaultParserResult } from 'parse-torrent-title'
// import { XMLParser } from 'fast-xml-parser'
import { appEnv } from '@config/env'
import { logger } from '@utils/logger'
import AppRouter from '@routes/index'
import morganMiddleware from '@middlewares/morgan.middleware'

const app = express()

app.use(helmet())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(cors())
app.use(morganMiddleware)
app.use(AppRouter)

app.listen(appEnv.PORT, () => {
  logger.info(`🚀 Starting app in ${appEnv.NODE_ENV}`)
  
  switch (appEnv.NODE_ENV) {
    case 'development':
    case 'test':
      logger.info(`🚀 Server listening on http://localhost:${appEnv.PORT}`)
      break
    case 'production':
    case 'staging':
      logger.info(`🚀 Server listening on port ${appEnv.PORT}`)
      break
  }
})
