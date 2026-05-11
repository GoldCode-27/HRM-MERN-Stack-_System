const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth.middleware');
const { createSalary, getSalaries } = require('../controllers/salary.controller');

const router = express.Router();

router.post('/', authenticate, requireRole('Admin'), createSalary);
router.get('/', authenticate, requireRole('Admin'), getSalaries);

module.exports = router;
