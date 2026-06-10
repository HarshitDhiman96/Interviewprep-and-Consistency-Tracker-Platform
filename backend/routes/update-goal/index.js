const express = require('express')
const authMiddleware = require('../../middleware/auth-middleware')
const { updateGoal } = require('../../controllers/auth-controller')

const updateGoalRoutes = express.Router()

updateGoalRoutes.post('/', authMiddleware, updateGoal)
updateGoalRoutes.put('/', authMiddleware, updateGoal)

module.exports = updateGoalRoutes
