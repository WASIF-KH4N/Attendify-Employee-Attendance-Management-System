import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Phone, Building2, Check, X, AlertCircle, Moon } from 'lucide-react';
import api from '../services/api';
import { CardSkeleton, ListSkeleton } from '../components/LoadingSkeleton';

const statusColors = {
  present: 'bg-emerald-100 text-emerald-700',
  absent: 'bg-red-100 text-red-700',
  late: 'bg-amber-100 text-amber-700',
  leave: 'bg-blue-100 text-blue-700',
  'half-day': 'bg-purple-100 text-purple-700',
  holiday: 'bg-slate-100 text-slate-600',
};

const statusIcons = {
  present: Check,
  absent: X,
  late: Clock,
  leave: Calendar,
  'half-day': AlertCircle,
  holiday: Moon,
};

const EmployeeHistory = ({ addToast }) => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/attendance/employee/${id}`);
        setData(res.data);
      } catch {
        addToast('Failed to load employee history', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return <div><CardSkeleton /><div className="mt-6"><ListSkeleton rows={5} /></div></div>;
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Employee not found</p>
        <Link to="/employees" className="text-indigo-600 text-sm mt-2 inline-block">Back to employees</Link>
      </div>
    );
  }

  const { employee, records, summary } = data;

  const summaryCards = [
    { label: 'Present', value: summary?.presentDays || 0, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Absent', value: summary?.absentDays || 0, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Late', value: summary?.lateDays || 0, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Leaves', value: summary?.leaveDays || 0, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Half Days', value: summary?.halfDays || 0, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Attendance', value: `${summary?.attendancePercentage || 0}%`, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/employees" className="p-2 hover:bg-white rounded-2xl transition-colors">
          <ArrowLeft size={24} className="text-slate-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">{employee?.fullName}</h2>
          <p className="text-slate-500 text-sm flex items-center gap-2">
            <Building2 size={14} /> {employee?.department || 'General'}
            <span className="inline-block w-1 h-1 bg-slate-300 rounded-full" />
            <Phone size={14} /> {employee?.phone}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
        {summaryCards.map((card, i) => (
          <div key={i} className={`${card.bg} rounded-2xl p-3 text-center`}>
            <p className={`text-lg font-bold ${card.color}`}>{card.value}</p>
            <p className="text-[10px] text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-slate-700 mb-4">Recent Records (Last 30)</h3>
        {records.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">No attendance records yet</p>
        ) : (
          <div className="space-y-2">
            {records.map((rec) => {
              const Icon = statusIcons[rec.status] || AlertCircle;
              return (
                <div key={rec._id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${statusColors[rec.status]?.split(' ')[0] || 'bg-slate-100'}`}>
                    <Icon size={16} className={statusColors[rec.status]?.split(' ')[1] || 'text-slate-600'} />
                  </div>
                  <div className="flex-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[rec.status] || 'bg-slate-100 text-slate-600'}`}>
                      {rec.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{rec.date}</p>
                  {rec.timeIn && <p className="text-xs text-slate-400">{rec.timeIn}</p>}
                  {rec.notes && <p className="text-xs text-slate-400 max-w-[120px] truncate">{rec.notes}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeHistory;
