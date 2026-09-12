import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2, ArrowLeft } from 'lucide-react';
import AuthButton from '../components/ui/AuthButton';
import api from '../services/api';

const AddEmployee = ({ addToast }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '', fatherName: '', phone: '', cnic: '',
    department: 'General', address: '', joiningDate: '', status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Required';
    if (!formData.fatherName.trim()) errs.fatherName = 'Required';
    if (!formData.phone.trim()) errs.phone = 'Required';
    if (!formData.cnic.trim()) errs.cnic = 'Required';
    else if (!/^\d{5}-\d{7}-\d$/.test(formData.cnic)) errs.cnic = 'Format: 12345-6789012-3';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/employees', formData);
      addToast('Employee added successfully!', 'success');
      navigate('/employees');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add employee';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (name) =>
    `w-full px-4 py-3.5 bg-white border ${errors[name] ? 'border-red-300' : 'border-slate-200'} rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800 placeholder:text-slate-400 text-[15px] transition-all`;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/employees')} className="p-2 hover:bg-white rounded-2xl transition-colors">
          <ArrowLeft size={24} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Add New Employee</h1>
          <p className="text-slate-500 text-sm">Fill in the employee details below</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <User size={18} /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                <input type="text" name="fullName" placeholder="Muhammad Ahmed" value={formData.fullName} onChange={handleChange} className={inputClass('fullName')} />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Father's Name *</label>
                <input type="text" name="fatherName" placeholder="Muhammad Ali" value={formData.fatherName} onChange={handleChange} className={inputClass('fatherName')} />
                {errors.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone *</label>
                <input type="tel" name="phone" placeholder="0300 1234567" value={formData.phone} onChange={handleChange} className={inputClass('phone')} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">CNIC *</label>
                <input type="text" name="cnic" placeholder="12345-6789012-3" value={formData.cnic} onChange={handleChange} className={inputClass('cnic')} />
                {errors.cnic && <p className="text-red-500 text-xs mt-1">{errors.cnic}</p>}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Building2 size={18} /> Work Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <input type="text" name="address" placeholder="Employee address" value={formData.address} onChange={handleChange} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800 placeholder:text-slate-400 text-[15px]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-slate-800 text-[15px]">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <AuthButton type="submit" loading={loading}>
              Add Employee
            </AuthButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
