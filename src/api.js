const mongodb = require('mongodb')
const Joi = require('joi')
const httpStatus = require('http-status')

const {todoCreationSchema, todoUpdateSchema} = require('./models/todo')
const logger = require('./logger')
const { client, collection: mongoCollection, name: dbName } = require('../config/mongo')


/**
 * Get all todos.
 * 
 * @returns {Array} Array of all todo objects
 */
function getAllTodos(req, res, next) {
    const db = client.db(dbName)
    const collection = db.collection(mongoCollection)

    collection.find({}).toArray(function(err, todos) {
        if (err) {
            return next(err)
        }

        res.status(httpStatus.OK).json(todos)
    })
}

/**
 * Create a todo.
 * 
 * @returns {Array} Array of all todo objects 
 */
function createTodo(req, res, next) {
    const { error, value: todoData } = Joi.validate(req.body, todoCreationSchema)

    if (error) {
        error.statusCode = httpStatus.BAD_REQUEST
        return next(error)
    }

    const db = client.db(dbName)
    const collection = db.collection(mongoCollection)

    collection.insertOne(todoData, function(err, result) {
        if (err) {
            const message = `Couldn't insert doc "${todoData}" in collection "${collection}": ${err}`
            logger.info(message)
            return res.json({ message })
        }

        return getAllTodos(req, res, next)
    })
}

/**
 * Delete a todo.
 * 
 * @returns {Array} Array of all todo objects
 */
function deleteTodo(req, res, next) {
    const db = client.db(dbName)
    const collection = db.collection(mongoCollection)

    const todoId = req.params.todo_id

    collection.deleteOne({ _id: new mongodb.ObjectID(todoId) }, function(err, result) {
        if (err) {
            return next(err)
        }

        logger.info(`Removed todo "${todoId}"`)
        return getAllTodos(req, res, next)
    })
}

/**
 * Update a todo.
 * 
 * @returns {Array} Array of all todo objects
 */
function updateTodo(req, res, next) {
    const {error, value: todoData} = Joi.validate(req.body, todoUpdateSchema)

    if(error) {
        res.statusCode = httpStatus.BAD_REQUEST
        return next(error)
    }
    
    const db = client.db(dbName)
    const collection = db.collection(mongoCollection)

    const {id: todoId, text: todoText} = todoData

    collection.updateOne(
        {_id: new mongodb.ObjectID(todoId)},
        {$set: {text: todoText}},
        function(err, result) {
            if(err) {
                return next(err)
            }

            logger.info(`Updated todo "${todoId}" with text "${todoText}"`)
            return getAllTodos(req, res, next)
        }
    )
}

module.exports = {
    createTodo,
    deleteTodo,
    getAllTodos,
    updateTodo,
}
