const httpStatus = require('http-status')

function handleError(err, req, res, next) {
    console.log(err)

    return res
        .status(err.statusCode || httpStatus.INTERNAL_SERVER_ERROR)
        .json(err)
}

module.exports = {
    handleError
}
