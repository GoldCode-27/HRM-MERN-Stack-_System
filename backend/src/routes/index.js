const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const attendanceRoutes = require('./attendance.routes');
const leaveRoutes = require('./leave.routes');
const evaluationRoutes = require('./evaluation.routes');
const employeeRoutes = require('./employee.routes');
const salaryRoutes = require('./salary.routes');
const passwordResetRoutes = require('./passwordReset.routes');
const reportRoutes = require('./report.routes');

router.use('/auth', authRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/leave', leaveRoutes);
router.use('/evaluations', evaluationRoutes);
router.use('/employees', employeeRoutes);
router.use('/admin/employees', employeeRoutes);
router.use('/salary', salaryRoutes);
router.use('/password-reset', passwordResetRoutes);
router.use('/reports', reportRoutes);

router.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'HRM API root' });
});

module.exports = router;
