import api from './api';

export const authService = {
  async register(fullName, email, password, targetRole) {
    const res = await api.post('/auth/register', { fullName, email, password, targetRole });
    if (res.data.token) {
      localStorage.setItem('preporbit_token', res.data.token);
      localStorage.setItem('preporbit_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('preporbit_token', res.data.token);
      localStorage.setItem('preporbit_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  async forgotPassword(email) {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },

  async getCurrentUser() {
    const res = await api.get('/users/me');
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await api.put('/users/me', profileData);
    return res.data;
  },

  logout() {
    localStorage.removeItem('preporbit_token');
    localStorage.removeItem('preporbit_user');
  },

  getStoredUser() {
    try {
      const userStr = localStorage.getItem('preporbit_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('preporbit_token');
  },
};
