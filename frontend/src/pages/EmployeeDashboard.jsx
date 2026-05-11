import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const EmployeeDashboard = ({ user }) => {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleClockIn = async () => {
    if (!navigator.geolocation) {
      setMessage('Geolocation is not available in your browser.');
      return;
    }

    setMessage('Getting current location...');
    setSubmitting(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await api.post('/attendance/check-in', {
            employeeId: user.id,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setMessage(response.data.message + ' (' + response.data.status + ')');
        } catch (error) {
          setMessage(error.response?.data?.error || 'Clock-in failed');
        } finally {
          setSubmitting(false);
        }
      },
      (error) => {
        setSubmitting(false);
        setMessage('Unable to get GPS location: ' + error.message);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-semibold">Employee Dashboard</h2>
        <p className="mt-2 text-slate-600">Welcome back, {user.name}. Use the controls below to clock in and view your information.</p>
        <button
          onClick={handleClockIn}
          disabled={submitting}
          className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Clocking in...' : 'Clock-in'}
        </button>
        {message && <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-slate-700">{message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <button onClick={() => navigate('/leave')} className="rounded-3xl bg-white p-6 text-left shadow-lg hover:bg-slate-50">
          <h3 className="text-xl font-semibold">Leave Request</h3>
          <p className="mt-2 text-slate-600">Submit a new leave request and keep your manager informed.</p>
        </button>
        <button onClick={() => navigate('/performance')} className="rounded-3xl bg-white p-6 text-left shadow-lg hover:bg-slate-50">
          <h3 className="text-xl font-semibold">Performance View</h3>
          <p className="mt-2 text-slate-600">Review your latest evaluation scores and remarks.</p>
        </button>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
