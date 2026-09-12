import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardCheck, BarChart3, Menu, X, LogOut, User as UserIcon, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PwaInstallBanner from './PwaInstallBanner';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { path: '/employees', label: 'Employees', icon: Users },
  { path: '/attendance', label: 'Attendance', icon: ClipboardCheck },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-0">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl"
            >
              <Menu size={22} />
            </button>
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <h1 className="text-xl font-semibold tracking-tight text-slate-800 hidden sm:block">AttendPro</h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-slate-100 rounded-2xl px-3.5 py-1.5 text-xs text-slate-500">
              <Calendar size={14} className="mr-1.5" />
              {dateStr}
            </div>
            <Link
              to="/profile"
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 rounded-2xl px-3.5 py-1.5 text-sm text-slate-700 transition-colors"
            >
              <UserIcon size={16} />
              <span className="hidden sm:inline text-sm font-medium">{user?.name || 'Admin'}</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex max-w-7xl mx-auto">
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-0 lg:top-14.25 left-0 w-64 h-full lg:h-[calc(100vh-57px)] bg-white border-r border-slate-200 z-50 transition-transform duration-300`}>
          <div className="p-4 lg:p-6 flex flex-col h-full">
            <div className="flex items-center justify-between lg:hidden mb-4">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Menu</span>
              <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-1 flex-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-200 mt-4">
              <div className="flex items-center gap-3 px-4 py-3 mb-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <span className="text-indigo-700 font-bold text-sm">{user?.name?.[0] || 'A'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.factoryName || 'Workshop'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-4 lg:p-6 min-h-[calc(100vh-57px)]">
          {children}
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 lg:hidden safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-colors ${
                  isActive ? 'text-indigo-600' : 'text-slate-500'
                }`}
              >
                <item.icon size={22} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <PwaInstallBanner />
    </div>
  );
};

export default Layout;
