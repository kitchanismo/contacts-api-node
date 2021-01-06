import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
  ManyToOne,
} from 'typeorm'
import { Contact } from './Contact'
import Joi = require('joi')
import { lettersOnly } from '../utils/joi'
import { User } from './User'

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  token: string

  @ManyToOne((type) => User, (user) => user.contacts) user: User
}
