import { Contact } from './../entity/Contact'
import { User } from './../entity/User'
import { getRepository } from 'typeorm'
import { Context } from './../contextProps'
import { ContactSaveValidator } from '../validators/contactValidator'

export class ContactController {
  async all({ req }: Context) {
    const { userId } = req.body

    const user = await getRepository(User).findOne({ id: +userId })

    return getRepository(Contact).find({ user })
  }

  async one({ req, res }: Context) {
    const contact = await getRepository(Contact).findOne(+req.params.id)
    return contact
      ? contact
      : res.status(404).send({ error: 'Not Found', status: 404 })
  }

  @ContactSaveValidator()
  async save({ req, res }: Context) {
    const {
      first_name,
      last_name,
      phone_number,
      contact_picture,
      country_code,
      is_favorite,
    } = req.body as Contact

    const user = await getRepository(User).findOne({ id: +req.body.userId })

    const { id } = await getRepository(Contact)
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

    return res.status(201).send({ id })
  }

  @ContactSaveValidator()
  async update({ req, res }: Context) {
    const {
      first_name,
      last_name,
      phone_number,
      contact_picture,
      country_code,
      is_favorite,
    } = req.body as Contact

    const { affected } = await getRepository(Contact).update(req.params.id, {
      first_name,
      last_name,
      phone_number,
      contact_picture,
      country_code,
      is_favorite,
    })

    if (!affected) return res.status(404).send({ status: 404, affected })

    return res.status(202).send({ status: 202, affected })
  }

  async remove({ req, res }: Context) {
    const contact = await getRepository(Contact).findOne(+req.params.id)
    if (!contact)
      return res.status(404).send({ error: 'Not found', status: 404 })

    await getRepository(Contact).remove(contact)

    return res.status(202).send({ status: 202, affected: +req.params.id })
  }
}
