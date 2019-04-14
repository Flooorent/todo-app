const Joi = require('joi')

const todoCreationSchema = Joi.object().keys({
    text: Joi.string().required()
})

const todoUpdateSchema = Joi.object().keys({
    id: Joi.string().required(),
    text: Joi.string().required()
})

module.exports = {
    todoCreationSchema,
    todoUpdateSchema,
}
