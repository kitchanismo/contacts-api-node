require('dotenv').config()
const cors = require('cors')
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { createRoute, routes } from './routes'
import { authenticateToken } from './utils/jwt'

const app = express()

app.use(bodyParser.json())
app.use(cors())

const PORT: number = +process.env.PORT || 4000

createConnection()
  .then(async (connection) => {
    routes.forEach((route) => {
      app[route.method](
        route.path,
        authenticateToken(route.isProtected),
        createRoute(route),
      )
    })

    app.listen(PORT)

    console.log(`Listening on http://${process.env.TYPEORM_HOST}:${PORT}`)
  })
  .catch((error) => {
    console.log(error.message)
  })
