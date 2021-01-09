import { Response } from 'express'
import { sign, verify } from 'jsonwebtoken'
import { Request } from 'express'

export const generateAccessToken = (user: { username: string; id: number }) =>
  sign(
    {
      data: user,
    },
    process.env.JWT_KEY, //to be in env
    { expiresIn: '10m' },
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

    const accessToken = req.cookies.accessToken

    if (accessToken == null) return res.status(401).send({ error: 'token' })

    verify(accessToken, process.env.JWT_KEY, (error: any, data: any) => {
      if (error) {
        if (error.name === 'TokenExpiredError')
          return res.status(403).send(error.name)

        return res.status(401).send({ error: 'auth' })
      }
      req.body.userId = data.data.id
      next()
    })
  }
}
