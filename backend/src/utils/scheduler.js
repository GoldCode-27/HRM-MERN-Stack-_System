const cron = require('node-cron');
const Employee = require('../models/employee.model');
const Attendance = require('../models/attendance.model');
const Leave = require('../models/leave.model');
const { sendEmail } = require('./email');

const buildReportContent = async () => {
  const totalEmployees = await Employee.countDocuments();
  const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayAttendance = await Attendance.countDocuments({ date: today });

  return {
    subject: 'Daily HRM Summary Report',
    text: `Daily summary report:\n- Total employees: ${totalEmployees}\n- Pending leaves: ${pendingLeaves}\n- Check-ins today: ${todayAttendance}`,
    html: `<p>Daily summary report</p><ul><li>Total employees: ${totalEmployees}</li><li>Pending leaves: ${pendingLeaves}</li><li>Check-ins today: ${todayAttendance}</li></ul>`,
  };
};

const scheduleDailyReport = () => {
  cron.schedule('0 18 * * *', async () => {
    try {
      const admins = await Employee.find({ role: 'Admin' }).select('email');
      if (admins.length === 0) {
        console.warn('Daily report skipped: no admin emails configured.');
        return;
      }

      const report = await buildReportContent();
      const to = admins.map((admin) => admin.email).join(',');
      await sendEmail({ to, subject: report.subject, text: report.text, html: report.html });
      console.log('Daily HRM summary report sent to admins.');
    } catch (error) {
      console.warn('Daily summary report failed:', error.message);
    }
  });
};

module.exports = { scheduleDailyReport };
