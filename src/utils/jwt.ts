import { Response } from 'express'
import { IContext } from '../interfaces/IContext'
import { sign, verify } from 'jsonwebtoken'
import { Request } from 'express'

export const generateToken = (user: { username: string; id: number }) =>
  sign(
    {
      data: user,
    },
    process.env.JWT_KEY, //to be in env
    { expiresIn: '1h' },
  )

export const authenticateToken = (isProtected: boolean) => {
  return (req: Request, res: Response, next: Function) => {
    if (!isProtected) return next()

    const authHeader = req.headers.authorization

    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    verify(token, process.env.JWT_KEY, (err: any, data: any) => {
      if (err) return res.sendStatus(403)
      req.body.userId = data.data.id
      next()
    })
  }
}
