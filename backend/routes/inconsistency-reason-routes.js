const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const { submitInconsistencyReason } = require('../controllers/inconsistency-reason-controller');

const routes = express.Router();

routes.post('/', authMiddleware, submitInconsistencyReason);
routes.post('/submit-reason', authMiddleware, submitInconsistencyReason);

module.exports = routes;
