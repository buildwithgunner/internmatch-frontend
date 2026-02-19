import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js'

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user on page refresh or after register/login
  const refreshUser = async () => {
    try {
      const res = await api.get('/me');
      setUser(res.data.user);
      setRole(res.data.role);
      return res.data.user;
    } catch (err) {
      console.error('Failed to refresh user', err);
      // Don't logout on refresh failure, might be a temporary network issue
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      refreshUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, selectedRole) => {
    const res = await api.post('/login', { email, password, role: selectedRole });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    setRole(res.data.role);
    return res.data;
  };

  const register = async (name, email, password, selectedRole, adminKey = null) => {
    const res = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation: password,
      role: selectedRole,
      admin_key: adminKey
    });
    
    // Don't store token or set user if verification is needed
    if (!res.data.needs_verification) {
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setRole(res.data.role);
    }
    
    return res.data;
  };

  const verifyOtp = async (email, role, otp) => {
    const res = await api.post('/verify-account', { email, role, otp });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    setRole(res.data.role);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error('Logout API failed', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setRole(null);
      navigate('/', { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      role, 
      loading, 
      login, 
      register, 
      verifyOtp,
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);