const express = require('express')

const { createTodo, deleteTodo, getAllTodos, updateTodo } = require('../api')

const router = express.Router()

router.get('/todos', getAllTodos)
router.post('/todo', createTodo)
router.delete('/todo/:todo_id', deleteTodo)
router.put('/todo', updateTodo)

module.exports = router
