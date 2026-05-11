const crypto = require('crypto');
const Employee = require('../models/employee.model');
const PasswordReset = require('../models/passwordReset.model');
const { sendEmail } = require('../utils/email');

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const employee = await Employee.findOne({ email });
  if (!employee) return res.status(404).json({ error: 'No employee found with that email' });

  const token = crypto.randomBytes(32).toString('hex');
  await PasswordReset.findOneAndUpdate(
    { employeeId: employee._id },
    { token, expiresAt: Date.now() + 1000 * 60 * 60 },
    { upsert: true, new: true }
  );

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
  void sendEmail({
    to: employee.email,
    subject: 'Password Reset Request',
    text: `Use the following link to reset your password:\n${resetUrl}\nThis link expires in one hour.`,
    html: `<p>Use the following link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in one hour.</p>`,
  });

  res.json({ message: 'Password reset link sent if the email exists' });
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Token and password are required' });

  const resetRequest = await PasswordReset.findOne({ token, expiresAt: { $gt: Date.now() } });
  if (!resetRequest) return res.status(400).json({ error: 'Invalid or expired reset token' });

  const employee = await Employee.findById(resetRequest.employeeId);
  if (!employee) return res.status(404).json({ error: 'Employee account not found' });

  employee.password = password;
  await employee.save();
  await PasswordReset.deleteOne({ _id: resetRequest._id });

  res.json({ message: 'Password has been reset successfully' });
};

module.exports = { requestPasswordReset, resetPassword };
