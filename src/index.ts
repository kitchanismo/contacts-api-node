require('dotenv').config()
const cors = require('cors')
import { Context } from './contextProps'
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { Request, Response } from 'express'
import { Routes } from './routes'
import { User } from './entity/User'
import { authenticateToken } from './utils/jwt'

createConnection()
  .then(async (connection) => {
    // create express app
    const app = express()
    app.use(bodyParser.json())
    app.use(cors())

    const PORT: number = +process.env.PORT || 4000

    // register express routes from defined application routes

    const createRoute = (route) => {
      return (req: Request, res: Response, next: Function) => {
        const result = new (route.controller as any)()[route.action]({
          req,
          res,
          next,
        } as Context)
        if (result instanceof Promise) {
          result.then((result) =>
            result !== null &&
            result !== undefined &&
            typeof result === 'object'
              ? res.send(result)
              : undefined,
          )
        } else if (result !== null && result !== undefined) {
          res.json(result)
        }
      }
    }

    Routes.forEach((route) => {
      app[route.method](
        '/api' + route.path,
        authenticateToken(route.isProtected),
        createRoute(route),
      )
    })

    app.listen(PORT)

    console.log(`Listening on http://${process.env.TYPEORM_HOST}:${PORT}`)
  })
  .catch((error) => console.log(error))
