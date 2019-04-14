const httpStatus = require('http-status')
const logger = require('./logger')

function handleError(err, req, res, next) {
    logger.error(err)

    return res
        .status(err.statusCode || httpStatus.INTERNAL_SERVER_ERROR)
        .json(err)
}

module.exports = {
    handleError
}
