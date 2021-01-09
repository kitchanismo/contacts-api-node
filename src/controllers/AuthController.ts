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

    res.cookie('accessToken', accessToken, { httpOnly: true })
    res.cookie('refreshToken', refreshToken, { httpOnly: true })

    return { message: 'jwt has set in cookie' }
  }

  async signout({ req, res }: IContext) {
    const { affected } = await this.tokenRepository.delete({
      token: req.cookies.refreshToken,
    })

    res.cookie('accessToken', '', {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    res.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(Date.now()),
    })

    return res.send({ affected })
  }

  async signoutAll({ req, res }: IContext) {
    const user = await this.userRepository.findOne({ id: req.body.userId })
    const { affected } = await this.tokenRepository.delete({
      user,
    })

    res.cookie('accessToken', '', {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    res.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(Date.now()),
    })

    return { affected }
  }

  async me({ req, res }: IContext) {
    const decoded: any = jwt.decode(req.cookies.refreshToken)
    return decoded ? { ...decoded.data } : res.status(401)
  }

  async refreshToken({ res, req }: IContext) {
    const refreshToken = req.cookies.refreshToken

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

            res.cookie('accessToken', generateAccessToken(data.data), {
              httpOnly: true,
            })
            return { message: 'jwt has set in cookie' }
          })
      },
    )
  }
}
