const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { createLeaveRequest, getLeaves, updateLeaveStatus } = require('../controllers/leave.controller');

router.post('/', authenticate, createLeaveRequest);
router.get('/', authenticate, requireRole('Admin', 'HR'), getLeaves);
router.put('/:id/status', authenticate, requireRole('Admin', 'HR'), updateLeaveStatus);

module.exports = router;
