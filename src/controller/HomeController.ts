import { Context } from './../contextProps'
import { getConnection } from 'typeorm'
import { Routes } from '../routes'

export class HomeController {
  async index({ res }: Context) {
    const routes = Routes.map((route) => {
      delete route.action
      return route
    })

    return { server: 'online', routes }
  }
}
