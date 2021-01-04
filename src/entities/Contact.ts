import { User } from './User'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import Joi = require('joi')
import { lettersOnly } from '../utils/joi'

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  first_name: string

  @Column()
  last_name: string

  @Column()
  country_code: string

  @Column()
  phone_number: string

  @Column()
  contact_picture: string

  @Column()
  is_favorite: boolean

  @ManyToOne((type) => User, (user) => user.contacts) user: User

  static schemaContact = {
    id: Joi.optional(),
    first_name: lettersOnly('First Name').min(1).max(30).required(),
    last_name: lettersOnly('Last Name').min(1).max(30).required(),
    phone_number: Joi.string().min(1).max(30).required().label('Phone Number'),
    country_code: Joi.string().min(1).max(30).required().label('Country Code'),
    contact_picture: Joi.string()
      .min(1)
      .max(200)
      .required()
      .label('Contact Picture'),
    is_favorite: Joi.boolean().required().label('Favorite'),
  }
}
