import db from '@utils/db'
import { logger } from '@utils/logger'
import asyncHandler from 'express-async-handler'

const health = asyncHandler(async (req, res) => {
  logger.info(await db.user.findMany())
  res.status(200).json({
    message: 'OK'
  })
})

export default { health }
