import * as jwt from 'jsonwebtoken'
import { Token } from './../entities/Token'
import { generateRefreshToken } from './../utils/jwt'
import { hashPassword } from '../utils/bcrypt'
import { generateAccessToken } from '../utils/jwt'
import { getRepository, QueryFailedError } from 'typeorm'
import { IContext } from '../interfaces/IContext'
import { User } from '../entities/User'
import {
  registerValidator,
  existValidator,
  signInValidator,
} from '../validators/userValidator'

export class AuthController {
  private userRepository = getRepository(User)
  private tokenRepository = getRepository(Token)

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
  async signin({ req, res }: IContext) {
    const { username, id } = req.body.user

    const accessToken = generateAccessToken({ username, id })

    const refreshToken = generateRefreshToken({ username, id })

    await this.tokenRepository.save({
      token: refreshToken,
      user: req.body.user,
    })

    return { accessToken, refreshToken }
  }

  async signout({ req, res }: IContext) {
    const { affected } = await this.tokenRepository.delete({
      token: req.body.refreshToken,
    })
    return { affected }
  }

  async signoutAll({ req, res }: IContext) {
    const user = await this.userRepository.findOne({ id: req.body.userId })
    const { affected } = await this.tokenRepository.delete({
      user,
    })
    return { affected }
  }

  async refreshToken({ res, req }: IContext) {
    const refreshToken = req.body.refreshToken

    if (!refreshToken) return res.sendStatus(401)

    return jwt.verify(
      refreshToken,
      process.env.JWT_KEY,
      (error: any, data: any) => {
        if (error) return res.sendStatus(401)

        return this.tokenRepository
          .findOne({ token: refreshToken })
          .then((token) => {
            if (!token) return res.sendStatus(401)

            return { accessToken: generateAccessToken(data.data) }
          })
      },
    )
  }
}
