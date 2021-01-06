import { Token } from './Token'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm'
import { Contact } from './Contact'
import Joi = require('joi')
import { lettersOnly } from '../utils/joi'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Index({ unique: true })
  @Column()
  username: string

  @Column()
  first_name: string

  @Column()
  last_name: string

  @Index({ unique: true })
  @Column()
  email: string

  @Column()
  password: string

  @OneToMany((type) => Contact, (contact) => contact.user)
  contacts: Contact[]

  @OneToMany((type) => Token, (token) => token.token)
  tokens: Token[]

  static schemaSignIn = {
    username: Joi.string()
      .alphanum()
      .min(1)
      .max(150)
      .required()
      .label('Username'),
    password: Joi.string().min(8).max(65).required().label('Password'),
  }

  static schemaRegister = {
    ...User.schemaSignIn,
    first_name: lettersOnly('Firstname').min(2).max(255).required(),
    last_name: lettersOnly('Lastname').min(2).max(255).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
      })
      .max(254)
      .label('Email'),
  }
}
