import { useState, useEffect } from 'react';
import { BarChart3, Download } from 'lucide-react';
import api from '../services/api';
import { CardSkeleton } from '../components/LoadingSkeleton';

const Reports = ({ addToast }) => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [department, setDepartment] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = { month, year };
      if (department) params.department = department;
      const res = await api.get('/attendance/reports/monthly', { params });
      setData(res.data);
    } catch {
      addToast('Failed to load report', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [month, year, department]);

  const handleExport = () => {
    if (!data) return;
    const csv = [
      ['Employee', 'Department', 'Present', 'Absent', 'Late', 'Leave', 'Half Day'].join(','),
      ...(data.employees || []).map(emp => {
        const empRecords = data.records.filter(r => r.employee?._id === emp._id);
        return [
          emp.fullName,
          emp.department,
          empRecords.filter(r => r.status === 'present').length,
          empRecords.filter(r => r.status === 'absent').length,
          empRecords.filter(r => r.status === 'late').length,
          empRecords.filter(r => r.status === 'leave').length,
          empRecords.filter(r => r.status === 'half-day').length,
        ].join(',');
      }),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${month}-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Report downloaded!', 'success');
  };

  const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Monthly Reports</h2>
          <p className="text-slate-500 text-sm mt-0.5">View and export attendance reports</p>
        </div>
        {data && (
          <button onClick={handleExport} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-2xl text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-indigo-200">
            <Download size={18} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mb-6">
        <div className="flex gap-3">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-indigo-500"
          >
            {monthNames.slice(1).map((name, i) => (
              <option key={i + 1} value={i + 1}>{name}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-indigo-500"
          >
            {[today.getFullYear(), today.getFullYear() - 1].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-indigo-500"
          >
            <option value="">All Dept</option>
            <option value="General">General</option>
            <option value="Production">Production</option>
            <option value="Packaging">Packaging</option>
            <option value="Warehouse">Warehouse</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[1,2,3,4].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-2xl p-4 border border-slate-100">
              <p className="text-2xl font-bold text-slate-800">{data.summary?.totalEmployees || 0}</p>
              <p className="text-xs text-slate-500">Total Employees</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-100">
              <p className="text-2xl font-bold text-emerald-600">{data.summary?.totalPresent || 0}</p>
              <p className="text-xs text-slate-500">Total Present</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-100">
              <p className="text-2xl font-bold text-red-600">{data.summary?.totalAbsent || 0}</p>
              <p className="text-xs text-slate-500">Total Absent</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-100">
              <p className="text-2xl font-bold text-amber-600">{data.summary?.totalLate || 0}</p>
              <p className="text-xs text-slate-500">Total Late</p>
            </div>
          </div>

          {data.records && data.records.length > 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Employee</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Dept</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Date</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data.records.map((rec) => (
                      <tr key={rec._id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-800">{rec.employee?.fullName || 'Unknown'}</td>
                        <td className="px-4 py-3 text-slate-500">{rec.employee?.department || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                            rec.status === 'present' ? 'bg-emerald-100 text-emerald-700' :
                            rec.status === 'absent' ? 'bg-red-100 text-red-700' :
                            rec.status === 'late' ? 'bg-amber-100 text-amber-700' :
                            rec.status === 'leave' ? 'bg-blue-100 text-blue-700' :
                            rec.status === 'half-day' ? 'bg-purple-100 text-purple-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{rec.date}</td>
                        <td className="px-4 py-3 text-slate-500">{rec.timeIn || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center">
              <BarChart3 size={48} className="text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">No records found</h3>
              <p className="text-slate-500 text-sm mt-1">No attendance data for {monthNames[month]} {year}</p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center">
          <BarChart3 size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">No data</h3>
          <p className="text-slate-500 text-sm mt-1">Select a month to view the report</p>
        </div>
      )}
    </div>
  );
};

export default Reports;
