const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth.middleware');
const { getSummaryReport, sendReportToAdmins } = require('../controllers/report.controller');

const router = express.Router();

router.get('/summary', authenticate, requireRole('Admin', 'HR'), getSummaryReport);
router.post('/send', authenticate, requireRole('Admin'), sendReportToAdmins);

module.exports = router;
