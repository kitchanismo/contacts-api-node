import { NextFunction } from 'express'
import { Response } from 'express'
import { Request } from 'express'

export interface Context {
  req: Request
  res: Response
  next: NextFunction
}
