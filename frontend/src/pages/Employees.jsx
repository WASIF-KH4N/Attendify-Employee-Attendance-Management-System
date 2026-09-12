import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Phone, Trash2, Edit, Eye, Building2, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import api from '../services/api';
import { ListSkeleton } from '../components/LoadingSkeleton';

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-slate-100 text-slate-600',
};

const Employees = ({ addToast }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (department) params.department = department;
      const res = await api.get('/employees', { params });
      setEmployees(res.data.employees);
      setTotalPages(res.data.pages || 1);
    } catch {
      addToast('Failed to load employees', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, department]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEmployees();
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await api.delete(`/employees/${id}`);
      addToast('Employee deleted successfully', 'success');
      setDeleteConfirm(null);
      fetchEmployees();
    } catch {
      addToast('Failed to delete employee', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Employees</h2>
          <p className="text-slate-500 text-sm mt-0.5">{employees.length} employees</p>
        </div>
        <Link to="/employees/add" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-2xl text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-indigo-200">
          <Plus size={18} />
          <span className="hidden sm:inline">Add Employee</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone or CNIC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none"
            />
          </div>
          <select
            value={department}
            onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-indigo-500"
          >
            <option value="">All Depts</option>
            <option value="General">General</option>
            <option value="Production">Production</option>
            <option value="Packaging">Packaging</option>
            <option value="Warehouse">Warehouse</option>
            <option value="Admin">Admin</option>
          </select>
        </form>
      </div>

      {loading ? (
        <ListSkeleton rows={6} />
      ) : employees.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
          <Users size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-1">No employees yet</h3>
          <p className="text-slate-500 text-sm mb-4">Add your first employee to get started</p>
          <Link to="/employees/add" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-medium">
            <Plus size={18} /> Add Employee
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {employees.map((emp) => (
              <div key={emp._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
                    <span className="text-indigo-700 font-bold text-lg">{emp.fullName?.[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-800 truncate">{emp.fullName}</p>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColors[emp.status] || statusColors.active}`}>
                        {emp.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1"><Phone size={12} />{emp.phone}</span>
                      {emp.department && <span className="flex items-center gap-1"><Building2 size={12} />{emp.department}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/employees/${emp._id}`} className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors">
                      <Eye size={18} className="text-slate-500" />
                    </Link>
                    <Link to={`/employees/edit/${emp._id}`} className="p-2.5 hover:bg-blue-50 rounded-xl transition-colors">
                      <Edit size={18} className="text-blue-500" />
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(emp._id)}
                      className="p-2.5 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                </div>

                {deleteConfirm === emp._id && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                    <p className="text-sm text-slate-600 mr-auto">Delete {emp.fullName}?</p>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      disabled={deleting}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 hover:bg-slate-200 rounded-xl disabled:opacity-30"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-slate-600 font-medium">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 hover:bg-slate-200 rounded-xl disabled:opacity-30"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Employees;
