const chai = require('chai')
const chaiHttp = require('chai-http')
const httpStatus = require('http-status')

const logger = require('../src/logger')
const app = require('../src/app')
const { client, name: dbName, collection: mongoCollection } = require('../config/mongo')

chai.use(chaiHttp).should()


// TODO: log mocha stuff to console (shouldn't have to do anything I guess)
// TODO: log mocha stuff and other logs to output log file
describe('/api', function() {

    before(function(done) {
        client.connect(function(err) {
            if(err) {
                throw new Error(err)
            }

            logger.info('Connected to mongo')
            done()
        })
    })

    after(function(done) {
        client.close(function(err) {
            if(err) {
                logger.error("Couldn't close MongoClient connection")
                throw new Error(err)
            }

            logger.info('MongoClient connection closed')
            done()
        })
    })

    afterEach(function(done) {
        client.db(dbName).dropCollection(mongoCollection, function(err) {
            if (err) {
                logger.error(`Couldn't drop test database ${dbName}`)
                throw new Error(err)
            }

            logger.info('Test collection dropped')
            done()
        })
    })
    
    describe('/api/todos GET', function() {

        beforeEach(function(done) {
            const db = client.db(dbName)
            const collection = db.collection(mongoCollection)

            const docs = [
                { text: 'First todo' },
                { text: 'Second todo' }
            ]

            collection.insertMany(docs, function(err, result) {
                const stringifiedDocs = JSON.stringify(docs)

                if (err) {
                    logger.error(`Couldn't insert ${stringifiedDocs} in test collection`)
                    throw new Error(err)
                }

                logger.info(`Inserted ${stringifiedDocs} in test database`)
                done()
            })
        })

        it('should get all todos on GET /api/todos', function(done) {
            chai.request(app)
                .get('/api/todos')
                .end(function(err, res) {
                    res.should.have.status(httpStatus.OK)
                    res.should.be.json
                    res.body.should.be.a('array')
                    res.body.should.have.lengthOf(2)
                    res.body[0].should.have.property('text')
                    done()
                })
        })
    })
    
    it('should add a single todo on POST /api/todo and return all todos', function(done) {
        const todoText = 'Some todo'

        chai.request(app)
            .post('/api/todo')
            .send({ 'text': todoText })
            .end(function(err, res) {
                res.should.have.status(httpStatus.OK)
                res.should.be.json
                res.body.should.be.a('array')
                res.body.should.have.lengthOf(1)
                res.body[0].should.have.property('text')
                res.body[0]['text'].should.equal(todoText)
                done()
            })
    })

    describe('/api/todos DELETE', function() {

        beforeEach(function(done) {
            const db = client.db(dbName)
            const collection = db.collection(mongoCollection)

            const docs = [
                { text: 'First todo' }
            ]

            collection.insertMany(docs, function(err, result) {
                const stringifiedDocs = JSON.stringify(docs)

                if (err) {
                    logger.error(`Couldn't insert ${stringifiedDocs} in test collection`)
                    throw new Error(err)
                }

                logger.info(`Inserted ${stringifiedDocs} in test database`)
                done()
            })
        })

        it('should delete a single todo on DELETE /api/todo/:todo_id and return all todos', function(done) {
            chai.request(app)
                .get('/api/todos')
                .end(function(err, res) {
                    chai.request(app)
                        .delete(`/api/todo/${res.body[0]._id}`)
                        .end(function(error, response) {
                            response.should.have.status(httpStatus.OK)
                            response.should.be.json
                            response.body.should.be.a('array')
                            response.body.should.have.lengthOf(0)
                            done()
                        })
                })
        })
    })

    describe('/api/todo PUT', function() {
        beforeEach(function(done) {
            const db = client.db(dbName)
            const collection = db.collection(mongoCollection)

            const docs = [
                { text: 'First todo' }
            ]

            collection.insertMany(docs, function(err, result) {
                const stringifiedDocs = JSON.stringify(docs)

                if (err) {
                    logger.error(`Couldn't insert ${stringifiedDocs} in test collection`)
                    throw new Error(err)
                }

                logger.info(`Inserted ${stringifiedDocs} in test database`)
                done()
            })
        })

        it('should update a single todo and return all todos', function(done) {
            chai.request(app)
                .get('/api/todos')
                .end(function(err, res) {
                    const todoId = res.body[0]._id
                    const newText = 'New text'

                    chai.request(app)
                        .put('/api/todo')
                        .send({id: todoId, text: newText})
                        .end(function(error, response) {
                            response.should.have.status(httpStatus.OK)
                            response.should.be.json
                            response.body.should.be.a('array')
                            response.body.should.have.lengthOf(1)
                            response.body[0]['_id'].should.equal(todoId)
                            response.body[0]['text'].should.equal(newText)
                            done()
                        })
                })
        })
    })
})
