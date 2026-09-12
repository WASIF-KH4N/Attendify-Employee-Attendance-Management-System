import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ToastContainer from './components/Toast';
import { useToast } from './hooks/useToast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/EditEmployee';
import Attendance from './pages/Attendance';
import EmployeeHistory from './pages/EmployeeHistory';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const AppContent = () => {
  const { toasts, addToast, removeToast } = useToast();

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Routes>
        <Route path="/login" element={<Login addToast={addToast} />} />
        <Route path="/register" element={<Register addToast={addToast} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout><Dashboard addToast={addToast} /></Layout>
            </ProtectedRoute>
          }
        />z
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <Layout><Employees addToast={addToast} /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/add"
          element={
            <ProtectedRoute>
              <Layout><AddEmployee addToast={addToast} /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/edit/:id"
          element={
            <ProtectedRoute>
              <Layout><EditEmployee addToast={addToast} /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees/:id"
          element={
            <ProtectedRoute>
              <Layout><EmployeeHistory addToast={addToast} /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Layout><Attendance addToast={addToast} /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout><Reports addToast={addToast} /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout><Profile addToast={addToast} /></Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
