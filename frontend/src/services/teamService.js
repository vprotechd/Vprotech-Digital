// services/teamService.js
import api from './api';

const createTeamFormData = (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'imageFile' || value === undefined || value === null) return;

    if (key === 'skills' || key === 'socialLinks') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  if (data.imageFile) {
    formData.append('image', data.imageFile);
  }

  return formData;
};

const teamService = {
  // Public routes
  getTeamMembers: async (params) => {
    const response = await api.get('/team', { params });
    return response.data;
  },

  getTeamMemberById: async (id) => {
    const response = await api.get(`/team/${id}`);
    return response.data;
  },

  // Admin routes
  getAllTeamMembersAdmin: async () => {
    const response = await api.get('/team/admin/all');
    return response.data;
  },

  getTeamStats: async () => {
    const response = await api.get('/team/admin/stats');
    return response.data;
  },

  createTeamMember: async (data) => {
    const response = await api.post('/team', createTeamFormData(data));
    return response.data;
  },

  updateTeamMember: async (id, data) => {
    const response = await api.put(`/team/${id}`, createTeamFormData(data));
    return response.data;
  },

  deleteTeamMember: async (id) => {
    const response = await api.delete(`/team/${id}`);
    return response.data;
  },

  toggleTeamMemberStatus: async (id) => {
    const response = await api.put(`/team/${id}/toggle-status`);
    return response.data;
  },

  uploadImage: async (formData) => {
    const response = await api.post('/team/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteImage: async (publicId) => {
    const response = await api.delete('/team/image', { data: { publicId } });
    return response.data;
  },
};

export default teamService;