import { userSchema } from '../schemas/user.schema'
import { TypeOf } from 'zod'

type UserDTOType = {
  id: string
  email: string
  ygg_passkey: string | null | undefined

  createdAt: Date
  updatedAt: Date
}

export default class UserDTO {
  toJson(user: TypeOf<typeof userSchema>['body']): UserDTOType {
    return {
      id: user.id,
      email: user.email,
      ygg_passkey: user.ygg_passkey,

      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
