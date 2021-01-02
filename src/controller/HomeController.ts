import { Context } from './../contextProps'
import { getConnection } from 'typeorm'
import { Routes } from '../routes'

export class HomeController {
  async index({ res }: Context) {
    const routes = Routes.map((route) => {
      return {
        method: route.method,
        path: route.path,
      }
    })

    return { server: 'online', routes }
  }
}
