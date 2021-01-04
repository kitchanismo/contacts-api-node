import { Contact } from '../entities/Contact'
import { User } from '../entities/User'
import { getRepository } from 'typeorm'
import { IContext } from '../interfaces/IContext'
import { contactSaveValidator } from '../validators/contactValidator'

export class ContactController {
  private contactRepository = getRepository(Contact)
  private userRepository = getRepository(User)

  async all({ req }: IContext) {
    const { userId } = req.body

    const user = await this.userRepository.findOne({ id: +userId })

    return this.contactRepository.find({ user })
  }

  async one({ req, res }: IContext) {
    const contact = await this.contactRepository.findOne(+req.params.id)
    return contact
      ? contact
      : res.status(404).send({ error: 'Not Found', status: 404 })
  }

  @contactSaveValidator
  async save({ req, res }: IContext) {
    const {
      first_name,
      last_name,
      phone_number,
      contact_picture,
      country_code,
      is_favorite,
    } = req.body as Contact

    const user = await this.userRepository.findOne({ id: +req.body.userId })

    const { id } = await this.contactRepository
      .save({
        first_name,
        last_name,
        phone_number,
        contact_picture,
        country_code,
        is_favorite,
        user,
      })
      .catch((error) => null)

    return { id }
  }

  @contactSaveValidator
  async update({ req, res }: IContext) {
    const {
      first_name,
      last_name,
      phone_number,
      contact_picture,
      country_code,
      is_favorite,
    } = req.body as Contact

    const { affected } = await this.contactRepository.update(req.params.id, {
      first_name,
      last_name,
      phone_number,
      contact_picture,
      country_code,
      is_favorite,
    })

    if (!affected) return res.status(404).send({ status: 404, affected })

    return { status: 202, affected }
  }

  async remove({ req, res }: IContext) {
    const contact = await this.contactRepository.findOne(+req.params.id)
    if (!contact)
      return res.status(404).send({ error: 'Not found', status: 404 })

    await this.contactRepository.remove(contact)

    return { status: 202, affected: +req.params.id }
  }
}
