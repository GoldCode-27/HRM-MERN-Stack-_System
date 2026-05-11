import { useEffect, useState } from 'react';
import api from '../api/axios';

const PerformanceView = ({ user }) => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvaluations = async () => {
      setError('');
      try {
        const response = await api.get('/evaluations', {
          params: { employeeId: user?.id },
        });
        setEvaluations(response.data.evaluations || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Unable to load performance data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadEvaluations();
    }
  }, [user]);

  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg">
      <h2 className="text-2xl font-semibold">Performance View</h2>
      <p className="mt-2 text-slate-600">Review your evaluation scores and remarks.</p>
      {loading ? (
        <div className="mt-6 text-slate-700">Loading evaluations...</div>
      ) : error ? (
        <div className="mt-6 rounded-3xl bg-rose-50 p-4 text-rose-700">{error}</div>
      ) : evaluations.length === 0 ? (
        <div className="mt-6 rounded-3xl bg-slate-50 p-4 text-slate-700">No evaluations found.</div>
      ) : (
        <div className="mt-6 space-y-4">
          {evaluations.map((evaluation) => (
            <div key={evaluation.id || evaluation._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-lg font-semibold">Score: {evaluation.score}</span>
                <span className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700">{new Date(evaluation.createdAt || evaluation.date || null).toLocaleDateString()}</span>
              </div>
              <p className="mt-3 text-slate-700">{evaluation.remarks || 'No remarks provided'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PerformanceView;
