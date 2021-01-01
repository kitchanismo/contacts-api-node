import { Context } from '../contextProps'
import { EntityTarget, Repository } from 'typeorm'

import { getRepository } from 'typeorm'

export class RepositoryController<T> {
  protected repository: Repository<T>

  constructor(entity: EntityTarget<T>) {
    this.repository = getRepository(entity)
  }

  protected async all(ctx: Context) {
    return this.repository.find()
  }

  protected async one({ req }: Context) {
    return this.repository.findOne(req.params.id)
  }

  protected async save({ req }: Context) {
    return this.repository.save(req.body)
  }

  protected async remove({ req }: Context) {
    let repoToRemove = await this.repository.findOne(req.params.id)
    await this.repository.remove(repoToRemove)
  }
}
