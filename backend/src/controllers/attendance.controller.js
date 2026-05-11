const { getDistance } = require('geolib');
const Employee = require('../models/employee.model');
const Attendance = require('../models/attendance.model');

const checkIn = async (req, res) => {
  const { employeeId, lat, lng } = req.body;

  if (!employeeId || lat == null || lng == null) {
    return res.status(400).json({ error: 'employeeId, lat, and lng are required' });
  }

  const employee = await Employee.findById(employeeId);
  if (!employee) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  if (!employee.officeLocation || employee.officeLocation.lat == null || employee.officeLocation.lng == null) {
    return res.status(400).json({ error: 'Office location is not configured for this employee' });
  }

  const distance = getDistance(
    { latitude: lat, longitude: lng },
    { latitude: employee.officeLocation.lat, longitude: employee.officeLocation.lng }
  );

  if (distance > 100) {
    return res.status(400).json({ error: 'You are outside the office perimeter' });
  }

  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  let attendance = await Attendance.findOne({ employeeId, date: today });
  if (attendance && attendance.checkIn) {
    return res.status(400).json({ error: 'Check-in already recorded for today' });
  }

  const checkInTime = now;
  const officeStart = new Date(now);
  officeStart.setHours(8, 30, 0, 0);

  const status = checkInTime <= officeStart ? 'Present' : 'Late';

  if (!attendance) {
    attendance = new Attendance({
      employeeId,
      date: today,
      checkIn: checkInTime,
      status,
      locationVerified: true,
    });
  } else {
    attendance.checkIn = checkInTime;
    attendance.status = status;
    attendance.locationVerified = true;
  }

  await attendance.save();

  res.json({
    message: 'Check-in recorded',
    distance,
    status,
    attendance: {
      id: attendance._id,
      employeeId: attendance.employeeId,
      date: attendance.date,
      checkIn: attendance.checkIn,
      status: attendance.status,
      locationVerified: attendance.locationVerified,
    },
  });
};

const getAttendanceLogs = async (req, res) => {
  const logs = await Attendance.find().populate('employeeId', 'name').sort({ date: -1 }).limit(50);
  res.json({ logs });
};

module.exports = { checkIn, getAttendanceLogs };
