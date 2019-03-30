const express = require('express')
const bodyParser = require('body-parser')

const { port: serverPort } = require('./config/server')
const { handleError } = require('./src/error')
const logger = require('./src/logger')

const app = express()

app.use(bodyParser.json())



app.use(handleError)

app.listen(serverPort, () => {
    console.log(`App listening on port ${serverPort}`)
})
