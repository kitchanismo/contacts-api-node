import { EntityTarget } from 'typeorm'
import { IRoute } from '../interfaces/IRoute'
import { IContext } from '../interfaces/IContext'
import { Response, Request } from 'express'

export const createController = (route) => {
  return (req: Request, res: Response, next: Function) => {
    const controller = new route.controller()[route.action]({
      req,
      res,
      next,
    } as IContext)

    if (controller instanceof Promise) {
      return controller.then((data) => res.send(data))
    }
    return res.json(controller)
  }
}
