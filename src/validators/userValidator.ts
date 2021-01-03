import { User } from './../entity/User'
import { Context } from './../contextProps'
import { onValidate } from '../utils/joi'
import { getRepository } from 'typeorm'
import { comparePassword } from '../utils/bcrypt'

export const RegisterValidator = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    let method = descriptor.value
    descriptor.value = function (ctx: Context) {
      const { username, password, email, first_name, last_name } = ctx.req
        .body as User

      const hasErrors = onValidate(
        { username, password, email, first_name, last_name },
        User.schemaRegister,
      )

      if (hasErrors) {
        return ctx.res.status(400).send({ error: hasErrors, status: 400 })
      }
      method = method.bind(this)
      method(ctx)
    }
  }
}

export const SignInValidator = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    let method = descriptor.value
    descriptor.value = async function (ctx: Context) {
      const { username, password } = ctx.req.body as User

      const hasErrors = onValidate({ username, password }, User.schemaSignIn)

      if (hasErrors) {
        return ctx.res.status(400).send({ error: hasErrors, status: 400 })
      }

      const user = await getRepository(User).findOne({
        username,
      })

      if (!user || !(await comparePassword(password, user.password))) {
        return ctx.res
          .status(401)
          .send({ error: 'Invalid username or password', status: 401 })
      }
      method = method.bind(this)
      method(ctx, user)
    }
  }
}

export const ExistValidator = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    let method = descriptor.value
    descriptor.value = async function (ctx: Context) {
      const repository = getRepository(User)

      const { username, email } = ctx.req.body as User

      const isUsernameExist = await repository
        .find({ username })
        .then((users) => users.length > 0)

      if (isUsernameExist) {
        return ctx.res
          .status(400)
          .send({ error: { username: 'Username is taken!' }, status: 400 })
      }

      const isEmailExist = await repository
        .find({ email })
        .then((users) => users.length > 0)

      if (isEmailExist) {
        return ctx.res
          .status(400)
          .send({ error: { email: 'Email is taken!' }, status: 400 })
      }

      method = method.bind(this)

      method(ctx)
    }
  }
}
