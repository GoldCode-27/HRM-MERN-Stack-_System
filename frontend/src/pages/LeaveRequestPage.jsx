import { useState } from 'react';
import api from '../api/axios';

const LeaveRequestPage = () => {
  const [type, setType] = useState('Vacation');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setSubmitting(true);

    try {
      const response = await api.post('/leave', { type, startDate, endDate });
      setMessage(response.data.message);
      setType('Vacation');
      setStartDate('');
      setEndDate('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Unable to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg">
      <h2 className="text-2xl font-semibold">Leave Request</h2>
      <p className="mt-2 text-slate-600">Submit a leave application for approval.</p>
      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Leave type</span>
          <select
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-800"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option>Vacation</option>
            <option>Sick</option>
            <option>Personal</option>
          </select>
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Start date</span>
            <input
              type="date"
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-800"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">End date</span>
            <input
              type="date"
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-800"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </label>
        </div>
        {message && <div className="rounded-3xl bg-slate-50 p-4 text-slate-800">{message}</div>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-2xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Submitting...' : 'Submit Leave Request'}
        </button>
      </form>
    </div>
  );
};

export default LeaveRequestPage;
