import { useState } from 'react';
import { User, Mail, Lock, ArrowRight, Building2 } from 'lucide-react';
import FormInput from '../components/ui/FormInput';
import AuthButton from '../components/ui/AuthButton';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = ({ addToast }) => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '', factoryName: '', email: '', password: '', confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(formData);
      addToast('Account created successfully! Please login.', 'success');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
          <h1 className="text-3xl font-semibold text-white tracking-tight">Get Started</h1>
          <p className="text-slate-400 mt-2 text-[15px]">Create your AttendPro account</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 p-8">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm">{error}</div>
            )}
            <FormInput label="Full Name" type="text" name="name" placeholder="Your name" value={formData.name} onChange={handleChange} icon={User} />
            <FormInput label="Factory / Shop Name" type="text" name="factoryName" placeholder="Your business name" value={formData.factoryName} onChange={handleChange} icon={Building2} />
            <FormInput label="Email Address" type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} icon={Mail} />
            <FormInput label="Password" type="password" name="password" placeholder="Min 6 characters" value={formData.password} onChange={handleChange} icon={Lock} />
            <FormInput label="Confirm Password" type="password" name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} icon={Lock} />

            <div className="mb-6 text-xs text-slate-500 flex items-start gap-2">
              <div className="mt-0.5">&bull;</div>
              <div>Password must be at least 6 characters</div>
            </div>

            <AuthButton type="submit" loading={loading}>
              Create Account <ArrowRight size={18} />
            </AuthButton>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          By signing up, you agree to our Terms and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Register;
