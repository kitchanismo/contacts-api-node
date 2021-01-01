import { comparePassword, hashPassword } from './../utils/bcrypt'
import { generateToken } from './../utils/jwt'
import { getRepository, QueryFailedError } from 'typeorm'
import { Context } from './../contextProps'
import { User } from '../entity/User'
import { onValidate } from '../utils/joi'

export class UserController {
  private repository = getRepository(User)

  async register({ req, res }: Context) {
    const {
      username,
      password,
      email,
      first_name,
      last_name,
    } = req.body as User

    const hasErrors = onValidate(
      { username, password, email, first_name, last_name },
      User.validatorRegister,
    )

    if (hasErrors) {
      return res.status(400).send({ error: hasErrors, status: 400 })
    }

    const isUsernameExist = await this.repository
      .find({ username })
      .then((users) => users.length > 0)

    if (isUsernameExist) {
      return res
        .status(400)
        .send({ error: { username: 'Username is taken!' }, status: 400 })
    }

    const isEmailExist = await this.repository
      .find({ email })
      .then((users) => users.length > 0)

    if (isEmailExist) {
      return res
        .status(400)
        .send({ error: { email: 'Email is taken!' }, status: 400 })
    }

    const { id } = await this.repository
      .save({
        username,
        password: await hashPassword(password),
        email,
        first_name,
        last_name,
      })
      .catch((error: QueryFailedError) => {
        console.log(error)
        return null
      })

    return { id }
  }

  async signin({ req, res }: Context) {
    const { username, password } = req.body as User

    const hasErrors = onValidate({ username, password }, User.valitorSignin)

    if (hasErrors) {
      return res.status(400).send({ error: hasErrors, status: 400 })
    }

    const user = await this.repository.findOne({
      username,
    })

    if (!user || !(await comparePassword(password, user.password))) {
      return res
        .status(401)
        .send({ error: 'Invalid username or password', status: 401 })
    }

    const token = generateToken({ username: user.username, id: user.id })

    return { token }
  }
}
