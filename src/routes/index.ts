import { HomeController } from '../controllers/HomeController'
import { IRoute } from '../interfaces/IRoute'
import { AuthController } from '../controllers/AuthController'
import { ContactController } from '../controllers/ContactController'

const userRoutes: IRoute<AuthController>[] = [
  {
    method: 'post',
    path: '/api/auth/register',
    controller: AuthController,
    action: 'register',
  },
  {
    method: 'post',
    path: '/api/auth/login',
    controller: AuthController,
    action: 'signin',
  },
]

const contactRoutes: IRoute<ContactController>[] = [
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

const homeRoute: IRoute<HomeController> = {
  method: 'get',
  path: '/',
  controller: HomeController,
  action: 'index',
}

export const routes = [homeRoute, ...userRoutes, ...contactRoutes]
