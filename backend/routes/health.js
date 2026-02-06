const express = require('express');
const { healthCheck, dbHealthCheck } = require('../controllers/healthController');

const router = express.Router();

// Health check endpoints
router.get('/', healthCheck);
router.get('/database', dbHealthCheck);

module.exports = router;