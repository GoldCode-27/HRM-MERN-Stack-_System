const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { checkIn, getAttendanceLogs } = require('../controllers/attendance.controller');

router.post('/check-in', checkIn);
router.get('/logs', authenticate, requireRole(['Admin', 'HR']), getAttendanceLogs);

module.exports = router;
