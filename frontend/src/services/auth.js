import api from './api';

export const login = async (token) => {
  const res = await api.post('/api/auth/login', { token });
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(res.data));
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const data = localStorage.getItem('user');
  return data ? JSON.parse(data) : null;
};
