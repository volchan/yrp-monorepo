import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export const generateHashedPassword = async (password: string) => await bcrypt.hash(password, 12)
export const validatePassword = async (password: string, hashedPassword: string) =>
  await bcrypt.compare(password, hashedPassword)

export const generateVerificationCode = () => {
  const verifyCode = crypto.randomBytes(32).toString('hex')
  return crypto.createHash('sha256').update(verifyCode).digest('hex')
}
