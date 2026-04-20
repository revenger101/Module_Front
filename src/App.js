import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { apiRequest } from './api/client';
import { notifyAdminNewUser } from './utils/emailService';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import StorefrontPage from './pages/store/StorefrontPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminAllUsersPage from './pages/admin/AdminAllUsersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminSuppliersPage from './pages/admin/AdminSuppliersPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ToastStack from './components/common/ToastStack';
import ConfirmationModal from './components/common/ConfirmationModal';

const SESSION_KEY = 'tp_auth_session';
const THEME_KEY = 'tp_theme';
const defaultSignIn = { username: '', password: '' };
const defaultSignUp = { username: '', email: '', password: '' };

function readTheme() {
  return localStorage.getItem(THEME_KEY) || 'aurora';
}

function readSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function resolveHomePath(session) {
  if (!session) {
    return '/signin';
  }
  return session.user.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/store';
}

function App() {
  const [session, setSession] = useState(readSession);
  const [theme, setTheme] = useState(readTheme);
  const [signInForm, setSignInForm] = useState(defaultSignIn);
  const [signUpForm, setSignUpForm] = useState(defaultSignUp);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Welcome');
  const [toasts, setToasts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [confirmation, setConfirmation] = useState({ open: false, title: '', message: '', resolver: null });

  const notify = useCallback((type, message, addActivity = true) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [{ id, type, message }, ...prev].slice(0, 5));

    if (addActivity) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setActivities((prev) => [{ id, message, at: now }, ...prev].slice(0, 30));
    }

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3800);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const requestConfirm = useCallback((title, message) => {
    return new Promise((resolve) => {
      setConfirmation({ open: true, title, message, resolver: resolve });
    });
  }, []);

  const handleConfirmResult = useCallback((result) => {
    if (confirmation.resolver) {
      confirmation.resolver(result);
    }
    setConfirmation({ open: false, title: '', message: '', resolver: null });
  }, [confirmation]);

  const persistSession = useCallback((nextSession) => {
    setSession(nextSession);
    if (nextSession) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'aurora' ? 'night' : 'aurora'));
  }, []);

  const handleUnauthorized = useCallback(() => {
    persistSession(null);
    setStatus('Session expired. Sign in again.');
    notify('error', 'Session expired. Please sign in again.', false);
  }, [persistSession, notify]);

  const submitSignIn = useCallback(async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: signInForm,
        auth: false
      });
      persistSession({ token: data.accessToken, user: data.user });
      setSignInForm(defaultSignIn);
      setStatus(`Signed in as ${data.user.username}`);
      notify('success', `Signed in as ${data.user.username}`, false);
    } catch (error) {
      setStatus(error.message);
      notify('error', error.message, false);
    } finally {
      setLoading(false);
    }
  }, [signInForm, persistSession, notify]);

  const submitSignUp = useCallback(async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: signUpForm,
        auth: false
      });
      persistSession({ token: data.accessToken, user: data.user });
      setSignUpForm(defaultSignUp);
      setStatus(`Welcome ${data.user.username}`);
      notify('success', `Welcome ${data.user.username}`, false);
      
      // Notify Admin via EmailJS
      notifyAdminNewUser({
        username: data.user.username,
        email: data.user.email || signUpForm.email || 'No email provided'
      });
    } catch (error) {
      setStatus(error.message);
      notify('error', error.message, false);
    } finally {
      setLoading(false);
    }
  }, [signUpForm, persistSession, notify]);

  function logout() {
    persistSession(null);
    setStatus('Signed out');
    notify('info', 'Signed out', false);
  }

  const homePath = resolveHomePath(session);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={homePath} replace />} />

        <Route
          path="/signin"
          element={
            session ? (
              <Navigate to={homePath} replace />
            ) : (
              <SignInPage
                form={signInForm}
                onFormChange={setSignInForm}
                onSubmit={submitSignIn}
                loading={loading}
                status={status}
                theme={theme}
                onToggleTheme={toggleTheme}
              />
            )
          }
        />

        <Route
          path="/signup"
          element={
            session ? (
              <Navigate to={homePath} replace />
            ) : (
              <SignUpPage
                form={signUpForm}
                onFormChange={setSignUpForm}
                onSubmit={submitSignUp}
                loading={loading}
                status={status}
                theme={theme}
                onToggleTheme={toggleTheme}
              />
            )
          }
        />

        <Route
          path="/store"
          element={
            <StorefrontPage
              session={session}
              onLogout={logout}
              onUnauthorized={handleUnauthorized}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          }
        />

        <Route
          path="/admin"
          element={
            session?.user?.role === 'ROLE_ADMIN' ? (
              <AdminLayout
                session={session}
                loading={loading}
                onLogout={logout}
                theme={theme}
                onToggleTheme={toggleTheme}
              />
            ) : (
              <Navigate to={session ? '/store' : '/signin'} replace />
            )
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <AdminDashboardPage
                session={session}
                onUnauthorized={handleUnauthorized}
                setGlobalLoading={setLoading}
                notify={notify}
                activities={activities}
              />
            }
          />
          <Route
            path="products"
            element={
              <AdminProductsPage
                session={session}
                onUnauthorized={handleUnauthorized}
                setGlobalLoading={setLoading}
                notify={notify}
                requestConfirm={requestConfirm}
              />
            }
          />
          <Route
            path="users"
            element={
              <AdminAllUsersPage
                session={session}
                onUnauthorized={handleUnauthorized}
                setGlobalLoading={setLoading}
                notify={notify}
              />
            }
          />
          <Route
            path="admins"
            element={
              <AdminUsersPage
                session={session}
                onUnauthorized={handleUnauthorized}
                setGlobalLoading={setLoading}
                notify={notify}
                requestConfirm={requestConfirm}
              />
            }
          />
          <Route
            path="categories"
            element={
              <AdminCategoriesPage
                session={session}
                onUnauthorized={handleUnauthorized}
                setGlobalLoading={setLoading}
                notify={notify}
                requestConfirm={requestConfirm}
              />
            }
          />
          <Route
            path="suppliers"
            element={
              <AdminSuppliersPage
                session={session}
                onUnauthorized={handleUnauthorized}
                setGlobalLoading={setLoading}
                notify={notify}
                requestConfirm={requestConfirm}
              />
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <ConfirmationModal
        open={confirmation.open}
        title={confirmation.title}
        message={confirmation.message}
        onCancel={() => handleConfirmResult(false)}
        onConfirm={() => handleConfirmResult(true)}
      />
    </>
  );
}

export default App;
