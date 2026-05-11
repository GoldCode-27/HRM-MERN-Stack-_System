import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [newSalary, setNewSalary] = useState({ employeeId: '', amount: '', month: '', notes: '' });

  useEffect(() => {
    const loadData = async () => {
      setError('');
      setStatusMessage('Loading admin dashboard...');
      try {
        const responses = await Promise.allSettled([
          api.get('/employees'),
          api.get('/attendance/logs'),
          api.get('/leave'),
          api.get('/salary'),
          api.get('/reports/summary'),
        ]);

        const [employeesRes, attendanceRes, leaveRes, salaryRes, summaryRes] = responses;

        if (employeesRes.status === 'fulfilled') {
          setEmployees(employeesRes.value.data.employees || []);
        }
        if (attendanceRes.status === 'fulfilled') {
          setAttendanceLogs(attendanceRes.value.data.logs || []);
        }
        if (leaveRes.status === 'fulfilled') {
          setLeaves(leaveRes.value.data.leaves || []);
        }
        if (salaryRes.status === 'fulfilled') {
          setSalaries(salaryRes.value.data.salaries || []);
        }
        if (summaryRes.status === 'fulfilled') {
          setSummary(summaryRes.value.data.report || {});
        }

        const failed = responses.find((result) => result.status === 'rejected');
        if (failed) {
          const err = failed.reason;
          setError(err.response?.data?.error || err.message || 'Unable to load some admin data');
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Unable to load admin data');
      } finally {
        setLoading(false);
        setStatusMessage('');
      }
    };

    loadData();
  }, []);

  const handleResetDevice = async (id) => {
    setStatusMessage('Resetting device binding...');
    try {
      await api.put(`/employees/${id}/reset-device`);
      setEmployees((current) => current.map((employee) => employee._id === id ? { ...employee, deviceId: null } : employee));
      setStatusMessage('Device ID reset successfully.');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to reset device ID');
    } finally {
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleUpdateLeaveStatus = async (id, status) => {
    setStatusMessage(`Updating leave status to ${status}...`);
    try {
      await api.put(`/leave/${id}/status`, { status });
      setLeaves((current) => current.map((leave) => leave._id === id ? { ...leave, status } : leave));
      setStatusMessage(`Leave ${status.toLowerCase()} successfully.`);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to update leave status');
    } finally {
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleAddSalary = async (e) => {
    e.preventDefault();
    setStatusMessage('Adding salary...');
    try {
      await api.post('/salary', newSalary);
      setNewSalary({ employeeId: '', amount: '', month: '', notes: '' });
      // Reload salaries
      const salaryResponse = await api.get('/salary');
      setSalaries(salaryResponse.data.salaries || []);
      setStatusMessage('Salary added successfully.');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to add salary');
    } finally {
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hrm_token');
    localStorage.removeItem('hrm_user');
    navigate('/login');
  };

  const menuItems = [
    { key: 'overview', label: 'Dashboard Overview', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { key: 'employees', label: 'Employee Management', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg> },
    { key: 'salary', label: 'Salary Management', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg> },
    { key: 'leaves', label: 'Leave Requests', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { key: 'attendance', label: 'Attendance Logs', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Dashboard Overview</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl bg-blue-50 p-6 text-center">
                <div className="flex justify-center mb-2">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-blue-600">{summary.totalEmployees || 0}</div>
                <div className="text-slate-600">Total Employees</div>
              </div>
              <div className="rounded-3xl bg-green-50 p-6 text-center">
                <div className="flex justify-center mb-2">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-green-600">{summary.pendingLeaves || 0}</div>
                <div className="text-slate-600">Pending Leaves</div>
              </div>
              <div className="rounded-3xl bg-purple-50 p-6 text-center">
                <div className="flex justify-center mb-2">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-purple-600">{summary.todayAttendance || 0}</div>
                <div className="text-slate-600">Today's Check-ins</div>
              </div>
            </div>
          </div>
        );
      case 'employees':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Employee Management</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto divide-y divide-slate-200">
                <thead>
                  <tr className="bg-slate-50 text-left text-sm text-slate-700">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Device Bound</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                  {employees.map((employee) => (
                    <tr key={employee._id}>
                      <td className="px-4 py-3">{employee.name}</td>
                      <td className="px-4 py-3">{employee.email}</td>
                      <td className="px-4 py-3">{employee.role}</td>
                      <td className="px-4 py-3">{employee.deviceId ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleResetDevice(employee._id)}
                          className="rounded-2xl bg-amber-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-amber-400"
                        >
                          Reset Device ID
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'salary':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Salary Management</h3>
            <form onSubmit={handleAddSalary} className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="grid gap-4 md:grid-cols-2">
                <select
                  value={newSalary.employeeId}
                  onChange={(e) => setNewSalary({ ...newSalary, employeeId: e.target.value })}
                  className="rounded-2xl border border-slate-300 px-4 py-2"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>{emp.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Amount"
                  value={newSalary.amount}
                  onChange={(e) => setNewSalary({ ...newSalary, amount: e.target.value })}
                  className="rounded-2xl border border-slate-300 px-4 py-2"
                  required
                />
                <input
                  type="month"
                  value={newSalary.month}
                  onChange={(e) => setNewSalary({ ...newSalary, month: e.target.value })}
                  className="rounded-2xl border border-slate-300 px-4 py-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Notes"
                  value={newSalary.notes}
                  onChange={(e) => setNewSalary({ ...newSalary, notes: e.target.value })}
                  className="rounded-2xl border border-slate-300 px-4 py-2"
                />
              </div>
              <button type="submit" className="mt-4 rounded-2xl bg-blue-600 px-6 py-2 text-white hover:bg-blue-500">
                Add Salary
              </button>
            </form>
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <h4 className="text-xl font-semibold">Salary Records</h4>
              <div className="mt-4 space-y-4">
                {salaries.map((salary) => (
                  <div key={salary._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-semibold">{salary.employeeId?.name || 'Employee'}</div>
                        <div className="text-sm text-slate-600">Month: {salary.month}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${salary.amount}</div>
                        <div className="text-sm text-slate-600">{salary.notes}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'leaves':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Leave Requests</h3>
            <div className="space-y-4">
              {leaves.map((leave) => (
                <div key={leave._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold">{leave.employeeId?.name || 'Employee'}</div>
                      <div className="text-sm text-slate-600">Type: {leave.type}</div>
                      <div className="text-sm text-slate-600">From: {leave.startDate} To: {leave.endDate}</div>
                    </div>
                    <div className="flex gap-2">
                      {leave.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateLeaveStatus(leave._id, 'Approved')}
                            className="rounded-2xl bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-500"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateLeaveStatus(leave._id, 'Rejected')}
                            className="rounded-2xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <div className={`rounded-full px-3 py-1 text-sm ${leave.status === 'Approved' ? 'bg-green-200 text-green-800' : leave.status === 'Rejected' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>
                        {leave.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'attendance':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Attendance Logs</h3>
            <p className="text-slate-600">Recent check-ins and location validations.</p>
            {attendanceLogs.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-6 text-slate-700">No attendance records available.</div>
            ) : (
              <div className="space-y-4">
                {attendanceLogs.map((log) => (
                  <div key={log._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold">{log.employeeId?.name || 'Employee'}</div>
                        <div className="text-sm text-slate-600">{new Date(log.date).toLocaleDateString()}</div>
                      </div>
                      <div className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700">{log.status}</div>
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-3 text-sm text-slate-700">
                      <div>Check-in: {log.checkIn ? new Date(log.checkIn).toLocaleTimeString() : 'N/A'}</div>
                      <div>Location verified: {log.locationVerified ? 'Yes' : 'No'}</div>
                      <div>Office distance: {log.distance || 'N/A'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-800 text-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold">Admin Menu</h2>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 px-4">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setSelectedMenu(item.key);
                  setSidebarOpen(false);
                }}
                className={`flex items-center w-full rounded-lg px-4 py-2 text-left hover:bg-slate-700 ${selectedMenu === item.key ? 'bg-slate-700' : ''}`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Navbar */}
        <header className="flex items-center justify-between bg-white p-4 shadow-lg">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="mr-4 md:hidden">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-lg font-semibold text-slate-900">Admin Dashboard</span>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="rounded-3xl bg-white p-8 shadow-lg">Loading admin data...</div>
          ) : (
            <>
              {error && <div className="rounded-3xl bg-rose-50 p-4 text-rose-700">{error}</div>}
              {statusMessage && <div className="rounded-3xl bg-slate-50 p-4 text-slate-700">{statusMessage}</div>}
              {renderContent()}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

