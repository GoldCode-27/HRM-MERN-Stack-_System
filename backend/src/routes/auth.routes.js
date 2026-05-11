const express = require('express');
const router = express.Router();
const { login, register, bootstrapAdmin } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.post('/login', login);
router.post('/bootstrap', bootstrapAdmin);
router.post('/register', authenticate, requireRole('Admin'), register);

module.exports = router;
