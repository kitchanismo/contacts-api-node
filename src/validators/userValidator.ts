import { User } from '../entities/User'
import { IContext } from '../interfaces/IContext'
import { onValidate } from '../utils/joi'
import { getRepository } from 'typeorm'
import { comparePassword } from '../utils/bcrypt'

export const registerValidator = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  let method = descriptor.value
  descriptor.value = function (ctx: IContext) {
    const { username, password, email, first_name, last_name } = ctx.req
      .body as User

    const hasErrors = onValidate(
      { username, password, email, first_name, last_name },
      User.schemaRegister,
    )

    if (hasErrors) {
      return ctx.res.status(400).send({ error: hasErrors, status: 400 })
    }
    return method.call(this, ctx)
  }
}

export const signInValidator = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  let method = descriptor.value
  descriptor.value = async function (ctx: IContext) {
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

    ctx.req.body.user = user

    return method.call(this, ctx)
  }
}

export const existValidator = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  let method = descriptor.value
  descriptor.value = async function (ctx: IContext) {
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

    return method.call(this, ctx)
  }
}
