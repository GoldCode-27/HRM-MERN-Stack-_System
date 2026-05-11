const jwt = require('jsonwebtoken');
const Employee = require('../models/employee.model');
const { sendEmail } = require('../utils/email');

const generateToken = (employee) => {
  const payload = {
    id: employee._id,
    email: employee.email,
    role: employee.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'supersecretjwtkey', {
    expiresIn: '8h',
  });
};

const login = async (req, res) => {
  const { email, password, deviceId } = req.body;

  if (!email || !password || !deviceId) {
    return res.status(400).json({ error: 'email, password and deviceId are required' });
  }

  const employee = await Employee.findOne({ email: email.toLowerCase().trim() });
  if (!employee) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const passwordMatches = await employee.comparePassword(password);
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (!employee.deviceId) {
    employee.deviceId = deviceId;
    await employee.save();
  } else if (employee.deviceId !== deviceId) {
    return res.status(403).json({ error: 'This account is bound to another device' });
  }

  const token = generateToken(employee);

  res.json({
    token,
    employee: {
      id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department,
      deviceId: employee.deviceId,
    },
  });
};

const register = async (req, res) => {
  const { name, email, password, role = 'Employee', department } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email, and password are required' });
  }

  if (!['Admin', 'HR', 'Employee'].includes(role)) {
    return res.status(400).json({ error: 'role must be Admin, HR, or Employee' });
  }

  const existing = await Employee.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({ error: 'Email is already in use' });
  }

  const employee = new Employee({
    name,
    email: email.toLowerCase().trim(),
    password,
    role,
    department,
  });

  await employee.save();

  void sendEmail({
    to: employee.email,
    subject: 'Welcome to the HRM Platform',
    text: `Hello ${employee.name},\n\nYour account has been created by your administrator. You can now log in using your email and password.`,
    html: `<p>Hello <strong>${employee.name}</strong>,</p><p>Your account has been created by your administrator. You can now log in using your email and password.</p>`,
  });

  res.status(201).json({
    message: 'Employee registered successfully',
    employee: {
      id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department,
    },
  });
};

const bootstrapAdmin = async (req, res) => {
  const { name, email, password, department } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email, and password are required' });
  }

  const existingAdmin = await Employee.findOne({ role: 'Admin' });
  if (existingAdmin) {
    return res.status(403).json({ error: 'An admin account already exists' });
  }

  const existing = await Employee.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({ error: 'Email is already in use' });
  }

  const employee = new Employee({
    name,
    email: email.toLowerCase().trim(),
    password,
    role: 'Admin',
    department,
  });

  await employee.save();

  res.status(201).json({
    message: 'First admin created successfully',
    employee: {
      id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department,
    },
  });
};

module.exports = { login, register, bootstrapAdmin };
