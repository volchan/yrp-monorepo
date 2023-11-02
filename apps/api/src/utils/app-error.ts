import { NextFunction, Request, Response } from 'express'

export default class AppError extends Error {
  status: string
  isOperational: boolean
  constructor(
    public statusCode: number = 500,
    public message: string,
  ) {
    super(message)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

export const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(401).send({ error: err })
}
