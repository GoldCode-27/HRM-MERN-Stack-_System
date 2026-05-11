const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { createEvaluation } = require('../controllers/evaluation.controller');

router.post('/', authenticate, requireRole('HR'), createEvaluation);

module.exports = router;
