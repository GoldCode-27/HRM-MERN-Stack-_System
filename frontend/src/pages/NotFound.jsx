import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="rounded-3xl bg-white p-10 shadow-lg text-center">
    <h2 className="text-3xl font-semibold">Page not found</h2>
    <p className="mt-4 text-slate-600">The page you are looking for does not exist.</p>
    <Link to="/" className="mt-6 inline-block rounded-2xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800">
      Return home
    </Link>
  </div>
);

export default NotFound;
