import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PreferencesProvider, usePreferencesContext } from './context/PreferencesContext';
import { ConfirmProvider } from './context/ConfirmContext';
import { API_BASE_URL } from './services/apiService';
import LandingPage from './components/pages/LandingPage';

// Code-split everything except the landing page, so first-time visitors
// don't download the dashboard and charts up front
const Login = lazy(() => import('./components/pages/Login'));
const Signup = lazy(() => import('./components/pages/Signup'));
const Dashboard = lazy(() => import('./components/pages/Dashboard'));
const ForgotPassword = lazy(() => import('./components/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./components/pages/VerifyEmail'));
const PrivacyPolicy = lazy(() => import('./components/pages/PrivacyPolicy'));
const AuthCallback = lazy(() => import('./components/auth/AuthCallback'));
const SupportPage = lazy(() => import('./components/support/SupportPage'));

function PageSpinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageSpinner />;
  }

  return user ? children : <Navigate to="/login" replace />;
}

// Toast Container with dynamic theme
function ThemedToastContainer() {
  const { theme } = usePreferencesContext();
  
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme === 'dark' ? 'dark' : 'light'}
      limit={3}
    />
  );
}

// App content with preferences
function AppContent() {
  const { user } = useAuth();

  // The API host sleeps when idle - start waking it while the user reads the page
  useEffect(() => {
    fetch(`${API_BASE_URL}/health`).catch(() => {});
  }, []);

  return (
    <PreferencesProvider userId={user?.id}>
      <ConfirmProvider>
        <Router>
          <Suspense fallback={<PageSpinner />}>
            <Routes>
              <Route path="/" element={<LandingPage />}/>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </ConfirmProvider>

      <ThemedToastContainer />
    </PreferencesProvider>
  );
}

// Main App - Wrap with QueryProvider first
function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;