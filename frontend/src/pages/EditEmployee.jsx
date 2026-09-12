import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AuthButton from '../components/ui/AuthButton';
import { CardSkeleton } from '../components/LoadingSkeleton';
import api from '../services/api';

const EditEmployee = ({ addToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/employees/${id}`);
        const emp = res.data.employee;
        setFormData({
          fullName: emp.fullName || '',
          fatherName: emp.fatherName || '',
          phone: emp.phone || '',
          cnic: emp.cnic || '',
          department: emp.department || 'General',
          address: emp.address || '',
          joiningDate: emp.joiningDate ? emp.joiningDate.split('T')[0] : '',
          status: emp.status || 'active',
        });
      } catch {
        addToast('Failed to load employee', 'error');
        navigate('/employees');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/employees/${id}`, formData);
      addToast('Employee updated successfully!', 'success');
      navigate('/employees');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-2xl"><CardSkeleton /></div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/employees')} className="p-2 hover:bg-white rounded-2xl transition-colors">
          <ArrowLeft size={24} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Edit Employee</h1>
          <p className="text-slate-500 text-sm">{formData.fullName}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800 text-[15px]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Father's Name</label>
              <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800 text-[15px]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800 text-[15px]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">CNIC</label>
              <input type="text" name="cnic" value={formData.cnic} onChange={handleChange} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800 text-[15px]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
              <select name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800 text-[15px]">
                <option value="General">General</option>
                <option value="Production">Production</option>
                <option value="Packaging">Packaging</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Joining Date</label>
              <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800 text-[15px]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800 text-[15px]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800 text-[15px]">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <AuthButton type="submit" loading={saving}>
              Save Changes
            </AuthButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
