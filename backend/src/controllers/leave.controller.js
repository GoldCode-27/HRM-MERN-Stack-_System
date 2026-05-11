const Leave = require('../models/leave.model');
const Employee = require('../models/employee.model');
const { sendEmail } = require('../utils/email');

const createLeaveRequest = async (req, res) => {
  const { type, startDate, endDate } = req.body;
  const employeeId = req.user.id;

  if (!type || !startDate || !endDate) {
    return res.status(400).json({ error: 'type, startDate, and endDate are required' });
  }

  const leave = new Leave({
    employeeId,
    type,
    startDate,
    endDate,
    status: 'Pending',
  });

  await leave.save();
  res.status(201).json({ message: 'Leave request submitted', leave });
};

const getLeaves = async (req, res) => {
  const leaves = await Leave.find().populate('employeeId', 'name email').sort({ createdAt: -1 });
  res.json({ leaves });
};

const updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ error: 'status must be Approved or Rejected' });
  }

  const leave = await Leave.findById(id).populate('employeeId');
  if (!leave) {
    return res.status(404).json({ error: 'Leave request not found' });
  }

  leave.status = status;
  await leave.save();

  void sendEmail({
    to: leave.employeeId.email,
    subject: `Leave Request ${status}`,
    text: `Your leave request from ${leave.startDate} to ${leave.endDate} has been ${status.toLowerCase()}.`,
    html: `<p>Your leave request from <strong>${leave.startDate}</strong> to <strong>${leave.endDate}</strong> has been <strong>${status.toLowerCase()}</strong>.</p>`,
  });

  res.json({ message: 'Leave status updated', leave });
};

module.exports = { createLeaveRequest, getLeaves, updateLeaveStatus };
