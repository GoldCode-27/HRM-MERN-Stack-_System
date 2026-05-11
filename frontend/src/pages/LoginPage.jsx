import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import api from '../api/axios';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceId(result.visitorId);
    };
    loadFingerprint();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password, deviceId });
      onLogin(response.data.token, response.data.employee);
      navigate(response.data.employee.role === 'Admin' ? '/admin' : '/employee');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 shadow-lg">
      <h2 className="mb-4 text-3xl font-semibold">Login</h2>
      <p className="mb-6 text-sm text-slate-500">Enter your email and password. The device ID is captured automatically.</p>
      <form className="space-y-4" onSubmit={handleSubmit}>
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
        <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Device ID: {deviceId || 'Detecting device...' }
        </div>
        {error && <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
        <button
          type="submit"
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={!deviceId || loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-slate-600">
        <span>Need to create the first admin? </span>
        <button onClick={() => navigate('/register')} className="font-semibold text-slate-900 hover:text-slate-700">
          Register here
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
