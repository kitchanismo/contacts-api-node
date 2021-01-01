import { User } from './../entity/User'
import { getRepository } from 'typeorm'
import { Context } from './../contextProps'
import { Contact } from '../entity/Contact'
import { onValidate } from '../utils/joi'

export class ContactController {
  private repository = getRepository(Contact)

  async all({ req }: Context) {
    const { userId } = req.body

    const user = await this.getCurrentUser(+userId)

    return this.repository.find({ user })
  }

  async getCurrentUser(id: number) {
    return getRepository(User).findOne({ id })
  }

  async one({ req, res }: Context) {
    const contact = await this.repository.findOne(+req.params.id)
    return contact
      ? contact
      : res.status(404).send({ error: 'Not Found', status: 404 })
  }

  async save({ req, res }: Context) {
    const {
      first_name,
      last_name,
      phone_number,
      contact_picture,
      country_code,
      is_favorite,
    } = req.body as Contact

    const hasErrors = onValidate(
      {
        first_name,
        last_name,
        phone_number,
        contact_picture,
        country_code,
        is_favorite,
      },
      Contact.validatorContact,
    )

    if (hasErrors) {
      return res.status(400).send({ error: hasErrors, status: 400 })
    }

    const user = await this.getCurrentUser(+req.body.userId)

    const { id } = await this.repository
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

  async update({ req, res }: Context) {
    const {
      first_name,
      last_name,
      phone_number,
      contact_picture,
      country_code,
      is_favorite,
    } = req.body as Contact
    const hasErrors = onValidate(
      {
        first_name,
        last_name,
        phone_number,
        contact_picture,
        country_code,
        is_favorite,
      },
      Contact.validatorContact,
    )

    if (hasErrors) {
      return res.status(400).send({ error: hasErrors, status: 400 })
    }

    const { affected } = await this.repository.update(+req.params.id, {
      first_name,
      last_name,
      phone_number,
      contact_picture,
      country_code,
      is_favorite,
    })

    return { affected }
  }

  async remove({ req, res }: Context) {
    const contact = await this.repository.findOne(req.params.id)
    if (!contact)
      return res.status(404).send({ error: 'Not found', status: 404 })

    await this.repository.remove(contact)

    return res.status(202).send({ status: 202 })
  }
}
