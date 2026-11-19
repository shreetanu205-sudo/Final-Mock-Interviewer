import api from './api';

export const analyticsService = {
  async getDashboardStats() {
    const res = await api.get('/analytics/dashboard');
    return res.data;
  },
};
