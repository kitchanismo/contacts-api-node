import { RouteProps } from './routeProps'
import { UserController } from '../controller/UserController'
import { ContactController } from '../controller/ContactController'

const userRoutes: RouteProps<UserController>[] = [
  {
    method: 'post',
    path: '/auth/register',
    controller: UserController,
    action: 'register',
  },
  {
    method: 'post',
    path: '/auth/login',
    controller: UserController,
    action: 'signin',
  },
]

const contactRoutes: RouteProps<ContactController>[] = [
  {
    method: 'get',
    path: '/contacts',
    controller: ContactController,
    action: 'all',
    isProtected: true,
  },
  {
    method: 'get',
    path: '/contacts/:id',
    controller: ContactController,
    action: 'one',
    isProtected: true,
  },
  {
    method: 'delete',
    path: '/contacts/:id',
    controller: ContactController,
    action: 'remove',
    isProtected: true,
  },
  {
    method: 'put',
    path: '/contacts/:id',
    controller: ContactController,
    action: 'update',
    isProtected: true,
  },
  {
    method: 'post',
    path: '/contacts',
    controller: ContactController,
    action: 'save',
    isProtected: true,
  },
]

export const Routes = [...userRoutes, ...contactRoutes]
