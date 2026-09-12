import { useState } from 'react';
import { User, Building2, Mail, Save } from 'lucide-react';
import AuthButton from '../components/ui/AuthButton';
import { useAuth } from '../context/AuthContext';

const Profile = ({ addToast }) => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    factoryName: user?.factoryName || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Name is required', 'warning');
      return;
    }
    setSaving(true);
    try {
      await updateProfile(formData);
      addToast('Profile updated successfully!', 'success');
    } catch {
      addToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">My Profile</h2>
        <p className="text-slate-500 text-sm mt-0.5">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <span className="text-indigo-700 font-bold text-2xl">{user?.name?.[0] || 'A'}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">{user?.name}</h3>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800 text-[15px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 text-[15px] cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Factory / Shop Name</label>
            <div className="relative">
              <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="factoryName"
                value={formData.factoryName}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800 text-[15px]"
              />
            </div>
          </div>

          <div className="pt-4">
            <AuthButton type="submit" loading={saving}>
              <Save size={18} /> Update Profile
            </AuthButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
