import { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/ui/FormInput';
import AuthButton from '../components/ui/AuthButton';
import { useAuth } from '../context/AuthContext';

const Login = ({ addToast }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
      addToast('Login successful!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-95">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-xl rounded-3xl mb-4 border border-white/20">
            <span className="text-3xl font-bold text-white tracking-tighter">A</span>
          </div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 mt-2 text-[15px]">Sign in to AttendPro</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 p-8">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm">
                {error}
              </div>
            )}
            <FormInput label="Email Address" type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} icon={Mail} />
            <FormInput label="Password" type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} icon={Lock} />
            <div className="flex items-center justify-between mb-6">
              <Link to="/register" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Create an account
              </Link>
            </div>
            <AuthButton type="submit" loading={loading}>
              Sign In <ArrowRight size={18} />
            </AuthButton>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
              Create one now
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          &copy; 2026 AttendPro. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
