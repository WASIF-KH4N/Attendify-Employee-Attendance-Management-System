import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, UserX, Clock, CalendarCheck, Briefcase, Building2, ArrowRight, AlertCircle, ClipboardCheck, BarChart3, UserPlus } from 'lucide-react';
import api from '../services/api';
import { CardSkeleton, ListSkeleton } from '../components/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  present: 'bg-emerald-500',
  absent: 'bg-red-500',
  late: 'bg-amber-500',
  leave: 'bg-blue-500',
  'half-day': 'bg-purple-500',
  holiday: 'bg-slate-300',
};

const Dashboard = ({ addToast }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data.stats);
        setRecentAttendance(res.data.recentAttendance || []);
      } catch {
        addToast('Failed to load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <div className="h-8 bg-slate-200 rounded-lg w-64 animate-pulse mb-2" />
          <div className="h-4 bg-slate-200 rounded-lg w-48 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[1,2,3,4].map(i => <CardSkeleton key={i} />)}
        </div>
        <ListSkeleton rows={4} />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Employees', value: stats?.totalEmployees || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Present Today', value: stats?.todayPresent || 0, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Absent Today', value: stats?.todayAbsent || 0, icon: UserX, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Late Today', value: stats?.todayLate || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'On Leave', value: stats?.todayLeave || 0, icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Half Day', value: stats?.todayHalfDay || 0, icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Unmarked', value: stats?.todayUnmarked || 0, icon: AlertCircle, color: 'text-slate-600', bg: 'bg-slate-100' },
    { label: 'Monthly %', value: stats?.monthlyAttendancePercent ? `${stats.monthlyAttendancePercent}%` : '0%', icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">Welcome, {user?.name || 'Admin'}!</h2>
        <p className="text-slate-500 text-sm mt-1">Here's your attendance overview for today</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className={`${card.bg} ${card.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                <card.icon size={20} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800">{card.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/attendance" className="bg-indigo-50 hover:bg-indigo-100 rounded-2xl p-4 transition-colors">
              <ClipboardCheck size={24} className="text-indigo-600 mb-2" />
              <p className="font-semibold text-slate-800 text-sm">Mark Attendance</p>
              <p className="text-xs text-slate-500 mt-0.5">Today's record</p>
            </Link>
            <Link to="/employees" className="bg-emerald-50 hover:bg-emerald-100 rounded-2xl p-4 transition-colors">
              <Users size={24} className="text-emerald-600 mb-2" />
              <p className="font-semibold text-slate-800 text-sm">Employees</p>
              <p className="text-xs text-slate-500 mt-0.5">Manage staff</p>
            </Link>
            <Link to="/employees/add" className="bg-blue-50 hover:bg-blue-100 rounded-2xl p-4 transition-colors">
              <UserPlus size={24} className="text-blue-600 mb-2" />
              <p className="font-semibold text-slate-800 text-sm">Add Employee</p>
              <p className="text-xs text-slate-500 mt-0.5">New hire</p>
            </Link>
            <Link to="/reports" className="bg-amber-50 hover:bg-amber-100 rounded-2xl p-4 transition-colors">
              <BarChart3 size={24} className="text-amber-600 mb-2" />
              <p className="font-semibold text-slate-800 text-sm">Reports</p>
              <p className="text-xs text-slate-500 mt-0.5">View analytics</p>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Recent Attendance</h3>
            <Link to="/attendance" className="text-indigo-600 text-sm font-medium flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {recentAttendance.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No attendance records yet</p>
          ) : (
            <div className="space-y-3">
              {recentAttendance.slice(0, 5).map((record, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${statusColors[record.status] || 'bg-slate-300'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{record.employee?.fullName || 'Unknown'}</p>
                    <p className="text-xs text-slate-500">{record.date}</p>
                  </div>
                  <span className="text-xs font-medium capitalize text-slate-600">{record.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
