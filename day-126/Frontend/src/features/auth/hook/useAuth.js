import { useDispatch } from 'react-redux';
import { register, login, getMe, logout, forgotPassword, resetPassword } from '../service/auth.api.js';
import { setUser, setLoading, setError } from '../auth.slice.js';

export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({ email, username, password }) {
    try {
      dispatch(setError(null));
      await register({ email, username, password });
      return true;
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || 'Registration failed')
      );
      return false;
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const [data] = await Promise.all([
        login({ email, password }),
        new Promise((resolve) => setTimeout(resolve, 1500))
      ]);
      dispatch(setUser(data.user));
      return true;
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Login failed'));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (err) {
      dispatch(setUser(null));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogout() {
    try {
      dispatch(setLoading(true));
      await Promise.all([
        logout(),
        new Promise((resolve) => setTimeout(resolve, 1500))
      ]);
      dispatch(setUser(null));
    } catch (err) {
      dispatch(
        setError(err.response?.data?.message || 'Logout failed')
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleForgotPassword({ email }) {
    try {
      dispatch(setError(null));
      await forgotPassword({ email });
      return true;
    } catch (err) {
      dispatch(
        setError(err.response?.data?.message || 'Failed to send recovery email')
      );
      return false;
    }
  }

  async function handleResetPassword({ token, password }) {
    try {
      dispatch(setError(null));
      await resetPassword({ token, password });
      return true;
    } catch (err) {
      dispatch(
        setError(err.response?.data?.message || 'Failed to reset password')
      );
      return false;
    }
  }

  function clearError() {
    dispatch(setError(null));
  }

  return {
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout,
    handleForgotPassword,
    handleResetPassword,
    clearError
  };
};
