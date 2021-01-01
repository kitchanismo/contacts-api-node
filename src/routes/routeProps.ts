import { EntityTarget } from 'typeorm'

export interface RouteProps<T> {
  method: string
  path: string
  controller: EntityTarget<T>
  action: string
  isProtected?: boolean | false
}
