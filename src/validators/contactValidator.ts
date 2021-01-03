import { Contact } from './../entity/Contact'
import { onValidate } from '../utils/joi'
import { Context } from './../contextProps'

export const contactSaveValidator = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  let method = descriptor.value
  descriptor.value = function (ctx: Context) {
    const {
      first_name,
      last_name,
      phone_number,
      contact_picture,
      country_code,
      is_favorite,
    } = ctx.req.body as Contact

    const hasErrors = onValidate(
      {
        first_name,
        last_name,
        phone_number,
        contact_picture,
        country_code,
        is_favorite,
      },
      Contact.schemaContact,
    )

    if (hasErrors) {
      return ctx.res.status(400).send({ error: hasErrors, status: 400 })
    }

    method.call(this, ctx)
  }
}
