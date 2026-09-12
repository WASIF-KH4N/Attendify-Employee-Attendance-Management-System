import { useState, useEffect } from 'react';
import { ClipboardCheck, Clock, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { CardSkeleton, ListSkeleton } from '../components/LoadingSkeleton';

const statuses = [
  { value: 'present', label: 'Present', color: 'bg-emerald-500', textColor: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  { value: 'absent', label: 'Absent', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  { value: 'late', label: 'Late', color: 'bg-amber-500', textColor: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  { value: 'leave', label: 'Leave', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { value: 'half-day', label: 'Half Day', color: 'bg-purple-500', textColor: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  { value: 'holiday', label: 'Holiday', color: 'bg-slate-400', textColor: 'text-slate-600', bgColor: 'bg-slate-50', borderColor: 'border-slate-200' },
];

const getStatusStyle = (status) => statuses.find(s => s.value === status);

const Attendance = ({ addToast }) => {
  const [records, setRecords] = useState([]);
  const [unmarked, setUnmarked] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [notes, setNotes] = useState({});
  const [timeIn, setTimeIn] = useState({});
  const [date, setDate] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/attendance/today');
      setRecords(res.data.attendanceRecords || []);
      setUnmarked(res.data.unmarkedEmployees || []);
      setStats(res.data.stats);
      setDate(res.data.date);
    } catch {
      addToast('Failed to load attendance data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleMarkAttendance = async (employeeId) => {
    const status = selectedStatus[employeeId];
    if (!status) {
      addToast('Please select a status', 'warning');
      return;
    }
    setSaving(true);
    try {
      await api.post('/attendance/mark', {
        employeeId,
        status,
        timeIn: timeIn[employeeId] || '',
        notes: notes[employeeId] || '',
      });
      addToast('Attendance marked!', 'success');
      fetchData();
      setSelectedStatus(prev => { const n = {...prev}; delete n[employeeId]; return n; });
      setNotes(prev => { const n = {...prev}; delete n[employeeId]; return n; });
      setTimeIn(prev => { const n = {...prev}; delete n[employeeId]; return n; });
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to mark attendance', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="h-8 bg-slate-200 rounded-lg w-48 animate-pulse mb-6" />
        <CardSkeleton />
        <div className="mt-6"><ListSkeleton rows={5} /></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Today's Attendance</h2>
          <p className="text-slate-500 text-sm mt-0.5">{date || 'Loading...'}</p>
        </div>
        <Link to="/dashboard" className="text-sm text-indigo-600 font-medium flex items-center gap-1">
          <ArrowLeft size={16} /> Dashboard
        </Link>
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center">
            <p className="text-lg font-bold text-slate-800">{stats.total}</p>
            <p className="text-[10px] text-slate-500">Total</p>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center">
            <p className="text-lg font-bold text-emerald-600">{stats.marked}</p>
            <p className="text-[10px] text-slate-500">Marked</p>
          </div>
          <div className="bg-white rounded-2xl p-3 border border-slate-100 text-center">
            <p className="text-lg font-bold text-amber-600">{stats.unmarked}</p>
            <p className="text-[10px] text-slate-500">Pending</p>
          </div>
        </div>
      )}

      {records.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Check size={16} className="text-emerald-500" /> Marked Attendance
          </h3>
          <div className="space-y-2">
            {records.map((rec) => {
              const s = getStatusStyle(rec.status);
              return (
                <div key={rec._id} className="bg-white rounded-2xl border border-slate-100 p-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-indigo-700 font-bold">{rec.employee?.fullName?.[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{rec.employee?.fullName}</p>
                    <p className="text-xs text-slate-500">{rec.employee?.department}</p>
                  </div>
                  <span className={`text-[11px] font-medium px-3 py-1 rounded-full ${s?.bgColor} ${s?.textColor}`}>
                    {s?.label}
                  </span>
                  {rec.timeIn && (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={12} /> {rec.timeIn}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {unmarked.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-500" /> Pending ({unmarked.length})
          </h3>
          <div className="space-y-3">
            {unmarked.map((emp) => (
              <div key={emp._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-indigo-700 font-bold">{emp.fullName?.[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{emp.fullName}</p>
                    <p className="text-xs text-slate-500">{emp.department || 'General'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {statuses.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSelectedStatus(prev => ({ ...prev, [emp._id]: s.value }))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                        selectedStatus[emp._id] === s.value
                          ? `${s.bgColor} ${s.textColor} ${s.borderColor}`
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 mb-3">
                  <div className="flex-1">
                    <input
                      type="time"
                      value={timeIn[emp._id] || ''}
                      onChange={(e) => setTimeIn(prev => ({ ...prev, [emp._id]: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                      placeholder="Time in"
                    />
                  </div>
                  <div className="flex-[2]">
                    <input
                      type="text"
                      placeholder="Notes (optional)"
                      value={notes[emp._id] || ''}
                      onChange={(e) => setNotes(prev => ({ ...prev, [emp._id]: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleMarkAttendance(emp._id)}
                  disabled={saving || !selectedStatus[emp._id]}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-sm font-medium py-3 rounded-xl transition-colors"
                >
                  {saving ? 'Saving...' : 'Mark Attendance'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {unmarked.length === 0 && records.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center">
          <ClipboardCheck size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">No employees found</h3>
          <p className="text-slate-500 text-sm mt-1">Add employees first to mark attendance</p>
        </div>
      )}
    </div>
  );
};

export default Attendance;
