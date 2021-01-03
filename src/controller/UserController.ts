import { hashPassword } from './../utils/bcrypt'
import { generateToken } from './../utils/jwt'
import { getRepository, QueryFailedError } from 'typeorm'
import { Context } from './../contextProps'
import { User } from '../entity/User'
import {
  registerValidator,
  existValidator,
  signInValidator,
} from '../validators/userValidator'

export class UserController {
  private userRepository = getRepository(User)

  @registerValidator
  @existValidator
  async register({ req, res }: Context) {
    const {
      username,
      password,
      email,
      first_name,
      last_name,
    } = req.body as User

    const { id } = await this.userRepository
      .save({
        username,
        password: await hashPassword(password),
        email,
        first_name,
        last_name,
      })
      .catch((error: QueryFailedError) => {
        return { id: 0 }
      })

    return { id }
  }

  @signInValidator
  async signin({ req, res }: Context) {
    const { username, id } = req.body.user

    const token = generateToken({ username, id })

    return { token }
  }
}
