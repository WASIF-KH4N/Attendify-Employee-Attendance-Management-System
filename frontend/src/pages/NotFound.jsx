import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="w-24 h-24 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl font-bold text-indigo-600">404</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h1>
        <p className="text-slate-500 text-sm mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-medium transition-colors shadow-lg shadow-indigo-200"
        >
          <Home size={18} /> Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
