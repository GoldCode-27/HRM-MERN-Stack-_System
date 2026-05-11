const jwt = require('jsonwebtoken');
const Employee = require('../models/employee.model');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey');
    const employee = await Employee.findById(payload.id).select('-password');
    if (!employee) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = {
      id: employee._id.toString(),
      email: employee.email,
      role: employee.role,
      employee,
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { authenticate };
