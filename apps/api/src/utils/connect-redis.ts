import { appEnv } from '@config/env'
import { createClient } from 'redis'

const redisClient = createClient({
  url: appEnv.REDIS_URL,
})

const connectRedis = async () => {
  try {
    await redisClient.connect()
    console.log('Redis client connect successfully')
    redisClient.set('try', 'Hello Welcome to Express with TypeORM')
  } catch (error) {
    console.log(error)
    setTimeout(connectRedis, 5000)
  }
}

connectRedis()

export default redisClient
