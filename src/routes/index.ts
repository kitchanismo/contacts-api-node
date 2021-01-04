import { Context } from './../contextProps'
import { Response, Request } from 'express'
import { HomeController } from './../controller/HomeController'
import { RouteProps } from './routeProps'
import { UserController } from '../controller/UserController'
import { ContactController } from '../controller/ContactController'

export const createRoute = (route) => {
  return (req: Request, res: Response, next: Function) => {
    const controller = new route.controller()[route.action]({
      req,
      res,
      next,
    } as Context)

    if (controller instanceof Promise) {
      return controller.then((data) => res.send(data))
    }
    return res.json(controller)
  }
}

const userRoutes: RouteProps<UserController>[] = [
  {
    method: 'post',
    path: '/api/auth/register',
    controller: UserController,
    action: 'register',
  },
  {
    method: 'post',
    path: '/api/auth/login',
    controller: UserController,
    action: 'signin',
  },
]

const contactRoutes: RouteProps<ContactController>[] = [
  {
    method: 'get',
    path: '/api/contacts',
    controller: ContactController,
    action: 'all',
    isProtected: true,
  },
  {
    method: 'get',
    path: '/api/contacts/:id',
    controller: ContactController,
    action: 'one',
    isProtected: true,
  },
  {
    method: 'delete',
    path: '/api/contacts/:id',
    controller: ContactController,
    action: 'remove',
    isProtected: true,
  },
  {
    method: 'put',
    path: '/api/contacts/:id',
    controller: ContactController,
    action: 'update',
    isProtected: true,
  },
  {
    method: 'post',
    path: '/api/contacts',
    controller: ContactController,
    action: 'save',
    isProtected: true,
  },
]

const homeRoute: RouteProps<HomeController> = {
  method: 'get',
  path: '/',
  controller: HomeController,
  action: 'index',
}

export const routes = [homeRoute, ...userRoutes, ...contactRoutes]
