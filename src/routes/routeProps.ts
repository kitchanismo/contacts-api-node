import { EntityTarget } from 'typeorm'

export interface RouteProps<T> {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  path: string
  controller: EntityTarget<T>
  action: string
  isProtected?: boolean | false
}
