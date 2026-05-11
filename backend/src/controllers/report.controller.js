const Employee = require('../models/employee.model');
const Attendance = require('../models/attendance.model');
const Leave = require('../models/leave.model');
const { sendEmail } = require('../utils/email');

const buildReportContent = async () => {
  const totalEmployees = await Employee.countDocuments();
  const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayAttendance = await Attendance.countDocuments({ date: today });

  return {
    subject: 'HRM Summary Report',
    text: `Summary Report:\n- Total employees: ${totalEmployees}\n- Pending leaves: ${pendingLeaves}\n- Check-ins today: ${todayAttendance}`,
    html: `<p>Summary Report</p><ul><li>Total employees: ${totalEmployees}</li><li>Pending leaves: ${pendingLeaves}</li><li>Check-ins today: ${todayAttendance}</li></ul>`,
    totalEmployees,
    pendingLeaves,
    todayAttendance,
  };
};

const getSummaryReport = async (req, res) => {
  const report = await buildReportContent();
  res.json({ report: { totalEmployees: report.totalEmployees, pendingLeaves: report.pendingLeaves, todayAttendance: report.todayAttendance }, message: 'Report summary generated' });
};

const sendReportToAdmins = async (req, res) => {
  const admins = await Employee.find({ role: 'Admin' }).select('email');
  if (!admins.length) {
    return res.status(404).json({ error: 'No admin emails found' });
  }

  const report = await buildReportContent();
  const to = admins.map((admin) => admin.email).join(',');
  void sendEmail({ to, subject: report.subject, text: report.text, html: report.html });

  res.json({ message: 'Report email sent to admins' });
};

module.exports = { getSummaryReport, sendReportToAdmins };
