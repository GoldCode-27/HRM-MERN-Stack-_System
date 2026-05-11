const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { getMyProfile, getAllEmployees, resetDeviceId } = require('../controllers/employee.controller');

router.get('/me', authenticate, getMyProfile);
router.get('/', authenticate, requireRole('Admin'), getAllEmployees);
router.put('/:id/reset-device', authenticate, requireRole('Admin'), resetDeviceId);

module.exports = router;
