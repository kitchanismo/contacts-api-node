import { hashPassword } from '../utils/bcrypt'
import { generateToken } from '../utils/jwt'
import { getRepository, QueryFailedError } from 'typeorm'
import { IContext } from '../interfaces/IContext'
import { User } from '../entities/User'
import {
  registerValidator,
  existValidator,
  signInValidator,
} from '../validators/userValidator'

export class AuthController {
  private authRepository = getRepository(User)

  @registerValidator
  @existValidator
  async register({ req, res }: IContext) {
    const {
      username,
      password,
      email,
      first_name,
      last_name,
    } = req.body as User

    const { id } = await this.authRepository
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
  async signin({ req, res }: IContext) {
    const { username, id } = req.body.user

    const token = generateToken({ username, id })

    return { token }
  }
}
