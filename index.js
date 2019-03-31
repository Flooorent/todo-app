const app = require('./src/app')
const logger = require('./src/logger')
const { client: mongoClient } = require('./config/mongo')


mongoClient.connect(function(err) {
    if(err) {
        logger.error(err)
        throw new Error(err)
    }

    logger.info('Connected to mongo')
    app.emit('ready')
})