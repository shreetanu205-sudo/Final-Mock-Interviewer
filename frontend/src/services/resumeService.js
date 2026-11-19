import api from './api';

export const resumeService = {
  async uploadResume(file, targetJobDescription) {
    const formData = new FormData();
    formData.append('file', file);
    if (targetJobDescription) {
      formData.append('targetJobDescription', targetJobDescription);
    }
    const res = await api.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async getUserResumes() {
    const res = await api.get('/resumes');
    return res.data;
  },

  async getResumeById(id) {
    const res = await api.get(`/resumes/${id}`);
    return res.data;
  },

  async updateResume(id, updateData) {
    const res = await api.put(`/resumes/${id}`, updateData);
    return res.data;
  },

  async reanalyzeResume(id, jobDescription) {
    const res = await api.post(`/resumes/${id}/analyze`, { jobDescription });
    return res.data;
  },

  async deleteResume(id) {
    const res = await api.delete(`/resumes/${id}`);
    return res.data;
  },
};
