import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const RegisterPage = ({ user }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Employee');
  const [department, setDepartment] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isAdmin = user?.role === 'Admin';
  const isBootstrap = !user;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const payload = { name, email, password, department };
      const endpoint = isBootstrap ? '/auth/bootstrap' : '/auth/register';
      if (isAdmin) {
        payload.role = role;
      }

      const response = await api.post(endpoint, payload);
      setMessage(response.data.message);

      if (isBootstrap) {
        setTimeout(() => { navigate('/login'); }, 1200);
      } else {
        setName('');
        setEmail('');
        setPassword('');
        setDepartment('');
        setRole('Employee');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-lg">
      <h2 className="mb-4 text-3xl font-semibold">{isBootstrap ? 'Create First Admin' : 'Register Employee'}</h2>
      <p className="mb-6 text-sm text-slate-500">
        {isBootstrap
          ? 'Create the first admin account for the system. After this, log in and use the admin register form for new employees.'
          : 'Register a new employee account. Only Admin users can add new team members.'}
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Name</span>
          <input
            type="text"
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-800"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-800"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {isAdmin && (
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Role</span>
            <select
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-800"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option>Employee</option>
              <option>HR</option>
              <option>Admin</option>
            </select>
          </label>
        )}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Department</span>
          <input
            type="text"
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-800"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </label>
        {message && <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}
        {error && <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Submitting...' : isBootstrap ? 'Create Admin' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
