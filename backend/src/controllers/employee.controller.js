const Employee = require('../models/employee.model');

const getMyProfile = async (req, res) => {
  if (!req.user || !req.user.employee) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.json({ employee: req.user.employee });
};

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find().select('-password');
  res.json({ employees });
};

const resetDeviceId = async (req, res) => {
  const { id } = req.params;

  const employee = await Employee.findById(id);
  if (!employee) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  employee.deviceId = null;
  await employee.save();

  res.json({ message: 'Employee device ID reset', employee: { id: employee._id, email: employee.email, deviceId: employee.deviceId } });
};

module.exports = { getMyProfile, getAllEmployees, resetDeviceId };
