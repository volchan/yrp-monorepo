import { date, object, string, TypeOf } from 'zod'

export const userSchema = object({
  body: object({
    id: string(),
    email: string(),
    passwordHash: string(),
    ygg_passkey: string().nullish(),
    validationCode: string().nullish(),
    createdAt: date(),
    updatedAt: date(),
  }),
})

export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: 'Email address is required',
    }).email('Invalid email address'),
    password: string({
      required_error: 'Password is required',
    }).min(8, 'Invalid email or password'),
  }),
})

export const createUserSchema = object({
  body: object({
    email: string({
      required_error: 'Email address is required',
    }).email('Invalid email address'),
    password: string({
      required_error: 'Password is required',
    })
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string({
      required_error: 'Please confirm your password',
    }),
  }).refine(data => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  }),
})

export const updateUserSchema = object({
  body: object({
    email: string().email('Invalid email address'),
    passwordHash: string({
      required_error: 'Password is required',
    })
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    ygg_passkey: string().optional(),
  }),
})

export type LoginUserInput = TypeOf<typeof loginUserSchema>['body']
export type CreateUserInput = Omit<TypeOf<typeof createUserSchema>['body'], 'passwordConfirm'>
export type UpdateUserInput = Omit<TypeOf<typeof updateUserSchema>['body'], 'ygg_passkey'>
