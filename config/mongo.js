const MongoClient = require('mongodb').MongoClient

const env = process.env.NODE_ENV || 'development'

const config = {
    url: 'mongodb://127.0.0.1',
    name: {
        'development': 'todo-app',
        'test': 'todo-app-test'
    },
    collection: 'todos'
}

const client = new MongoClient(config.url)

module.exports = {
    client,
    name: config.name[env],
    collection: config.collection,
}
