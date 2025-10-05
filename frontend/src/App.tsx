import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import Layout from './components/common/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import QRScanner from './components/qr/QRScanner';
import './styles/globals.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

// QR Scanner Page Component
const QRScannerPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">QR Code Scanner</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Scan student QR codes to mark attendance
        </p>
      </div>
      <QRScanner />
    </div>
  );
};

// My QR Code Page Component
const MyQRPage: React.FC = () => {
  const [qrCode, setQrCode] = React.useState<string>('');
  const [loading, setLoading] = React.useState(true);
  const [expiresAt, setExpiresAt] = React.useState<string>('');

  React.useEffect(() => {
    const fetchQR = async () => {
      try {
        const { qrAPI } = await import('./utils/api');
        const response = await qrAPI.getMyQR();
        setQrCode(response.data.qrCode);
        setExpiresAt(response.data.expiresAt);
      } catch (error) {
        console.error('Error fetching QR code:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQR();
  }, []);

  const refreshQR = async () => {
    setLoading(true);
    try {
      const { qrAPI } = await import('./utils/api');
      const response = await qrAPI.getMyQR();
      setQrCode(response.data.qrCode);
      setExpiresAt(response.data.expiresAt);
    } catch (error) {
      console.error('Error refreshing QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My QR Code</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Show this QR code to mark your attendance
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        {qrCode && (
          <div className="space-y-4">
            <img 
              src={qrCode} 
              alt="Student QR Code" 
              className="mx-auto border-2 border-gray-200 dark:border-gray-600 rounded-lg"
            />
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Expires at: {new Date(expiresAt).toLocaleString()}</p>
            </div>

            <button
              onClick={refreshQR}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Refresh QR Code
            </button>

            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <p>• QR codes expire after 5 minutes for security</p>
              <p>• Show this to your teacher or scan at the attendance station</p>
              <p>• Refresh if the code has expired</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Placeholder components for other routes
const StudentsPage: React.FC = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Students</h1>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <p className="text-gray-600 dark:text-gray-400">Students management page - Coming soon!</p>
    </div>
  </div>
);

const ReportsPage: React.FC = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Reports</h1>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <p className="text-gray-600 dark:text-gray-400">Reports and analytics page - Coming soon!</p>
    </div>
  </div>
);

const NotificationsPage: React.FC = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Notifications</h1>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <p className="text-gray-600 dark:text-gray-400">Notifications page - Coming soon!</p>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />

              {/* Protected Routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="qr-scanner" element={<QRScannerPage />} />
                <Route path="my-qr" element={<MyQRPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>

            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;