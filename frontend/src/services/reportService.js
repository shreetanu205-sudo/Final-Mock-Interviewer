import api from './api';

export const reportService = {
  async getUserReports() {
    const res = await api.get('/reports');
    return res.data;
  },

  async getReportByInterviewId(interviewId) {
    const res = await api.get(`/reports/${interviewId}`);
    return res.data;
  },

  async generateReport(interviewId) {
    const res = await api.post(`/reports/${interviewId}/generate`);
    return res.data;
  },
};
