import api from './api';

export const interviewService = {
  async createInterview(config) {
    const res = await api.post('/interviews', config);
    return res.data;
  },

  async getUserInterviews() {
    const res = await api.get('/interviews');
    return res.data;
  },

  async getInterviewById(id) {
    const res = await api.get(`/interviews/${id}`);
    return res.data;
  },

  async getBatch(interviewId, batchNumber) {
    const res = await api.get(`/interviews/${interviewId}/batch/${batchNumber}`);
    return res.data;
  },

  async generateBatch(interviewId, batchNumber) {
    const res = await api.post(`/interviews/${interviewId}/generate-batch?batchNumber=${batchNumber}`);
    return res.data;
  },

  async submitBatch(interviewId, batchNumber, answers) {
    const res = await api.post(`/interviews/${interviewId}/submit-batch`, {
      batchNumber,
      answers,
    });
    return res.data;
  },

  async completeInterview(interviewId) {
    const res = await api.post(`/interviews/${interviewId}/complete`);
    return res.data;
  },
};
