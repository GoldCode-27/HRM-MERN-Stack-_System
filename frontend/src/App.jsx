import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LeaveRequestPage from './pages/LeaveRequestPage';
import PerformanceView from './pages/PerformanceView';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('hrm_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('hrm_token');
    if (!storedToken) {
      setUser(null);
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('hrm_token', token);
    localStorage.setItem('hrm_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('hrm_token');
    localStorage.removeItem('hrm_user');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <header className="bg-white shadow-sm">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">HRM System</h1>
              <p className="text-sm text-slate-500">Employee and admin tools for attendance, leave, and evaluation.</p>
            </div>
            {user ? (
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                <span className="font-medium text-slate-700">{user.name} ({user.role})</span>
                <button onClick={handleLogout} className="rounded bg-slate-800 px-4 py-2 text-white hover:bg-slate-900">
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </header>

        <main className="mx-auto max-w-6xl p-4">
          <Routes>
            <Route path="/" element={user ? <Navigate to={user.role === 'Admin' ? '/admin' : '/employee'} /> : <Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage user={user} />} />
            <Route path="/employee" element={<ProtectedRoute user={user}><EmployeeDashboard user={user} /></ProtectedRoute>} />
            <Route path="/leave" element={<ProtectedRoute user={user}><LeaveRequestPage /></ProtectedRoute>} />
            <Route path="/performance" element={<ProtectedRoute user={user}><PerformanceView user={user} /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute user={user} requiredRole="Admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
