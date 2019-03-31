const express = require('express')
const bodyParser = require('body-parser')

const logger = require('./logger')
const { handleError } = require('../src/error')
const routers = require('../src/routers')
const { port } = require('../config/server')


const app = express()

app.use(bodyParser.json())

app.use('/api', routers.api)

app.use(handleError)

app.on('ready', function() {
    app.listen(port, () => {
        logger.info(`App listening on port ${port}`)
    })
})

module.exports = app
