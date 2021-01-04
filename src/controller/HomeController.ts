import { Context } from './../contextProps'
import { getConnection } from 'typeorm'
import { routes } from '../routes'

export class HomeController {
  async index({ res }: Context) {
    const _routes = routes.map((route) => {
      return {
        method: route.method,
        path: route.path,
      }
    })

    return { server: 'online', _routes }
  }
}
