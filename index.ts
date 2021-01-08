require('dotenv').config()

import 'reflect-metadata'
import * as cors from 'cors'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import { routes } from './src/routes'
import { createConnection } from 'typeorm'
import { authenticateToken } from './src/utils/jwt'
import { createController } from './src/factories/createController'

const app = express()

const whitelist =
  process.env.NODE_ENV === 'production'
    ? ['https://kitchan-contacts.netlify.app']
    : ['http://localhost:3000']

app.use(cookieParser())
app.use(bodyParser.json())
app.use(
  cors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  }),
)

const PORT: number = +process.env.PORT || 5000

createConnection()
  .then(async (connection) => {
    //dynamically creating routes
    routes.forEach((route) => {
      app[route.method](
        route.path,
        authenticateToken(route.isProtected),
        //add middleware here
        createController(route),
      )
    })

    app.listen(PORT)

    console.log(`Listening on http://${process.env.TYPEORM_HOST}:${PORT}`)
  })
  .catch((error) => {
    console.log(error.message)
  })
