import { Response } from 'express'
import { sign, verify } from 'jsonwebtoken'
import { Request } from 'express'

export const generateAccessToken = (user: { username: string; id: number }) =>
  sign(
    {
      data: user,
    },
    process.env.JWT_KEY, //to be in env
    { expiresIn: '5m' },
  )

export const generateRefreshToken = (user: { username: string; id: number }) =>
  sign(
    {
      data: user,
    },
    process.env.JWT_KEY, //to be in env
    { expiresIn: '1w' },
  )

export const authenticateToken = (isProtected: boolean) => {
  return (req: Request, res: Response, next: Function) => {
    if (!isProtected) return next()

    const authHeader = req.headers.authorization

    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    verify(token, process.env.JWT_KEY, (error: any, data: any) => {
      if (error) {
        if (error.name === 'TokenExpiredError') return res.sendStatus(403)

        return res.sendStatus(401)
      }
      req.body.userId = data.data.id
      next()
    })
  }
}
