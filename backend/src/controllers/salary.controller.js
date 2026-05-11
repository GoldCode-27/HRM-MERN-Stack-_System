const Salary = require('../models/salary.model');
const Employee = require('../models/employee.model');
const { sendEmail } = require('../utils/email');

const createSalary = async (req, res) => {
  const { employeeId, amount, month, notes } = req.body;

  if (!employeeId || amount == null || !month) {
    return res.status(400).json({ error: 'employeeId, amount, and month are required' });
  }

  const salary = new Salary({ employeeId, amount, month, notes });
  await salary.save();

  const employee = await Employee.findById(employeeId).select('name email');
  const admins = await Employee.find({ role: 'Admin' }).select('email');
  const adminEmails = admins.map((admin) => admin.email).join(',');

  void sendEmail({
    to: adminEmails || employee.email,
    subject: 'New Salary Entry Created',
    text: `A salary entry has been created for ${employee?.name || 'an employee'} (${employee?.email || 'unknown'}). Amount: ${amount} for ${month}.`,
    html: `<p>A salary entry has been created for <strong>${employee?.name || 'an employee'}</strong> (${employee?.email || 'unknown'}).</p><p>Amount: <strong>${amount}</strong> for month: <strong>${month}</strong>.</p>`,
  });

  res.status(201).json({ message: 'Salary record created', salary });
};

const getSalaries = async (req, res) => {
  const salaries = await Salary.find().sort({ createdAt: -1 }).populate('employeeId', 'name email');
  res.json({ salaries });
};

module.exports = { createSalary, getSalaries };
