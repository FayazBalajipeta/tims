import apiClient from './api';
import { mockAPI } from './mockAPI';

// Toggle this to use mock API (true) or real API (false)
const USE_MOCK_API = false;

export const userService = {
  // Get all users
  getAllUsers: async (params) => {
    if (USE_MOCK_API) {
      return await mockAPI.getUsers();
    }
    const response = await apiClient.get('/users', { params });
    // Backend returns: { status: 'success', count: X, users: [...] }
    return { users: response.data.users || [] };
  },

  // Get user by ID
  getUserById: async (userId) => {
    if (USE_MOCK_API) {
      return await mockAPI.getUserById(userId);
    }
    const response = await apiClient.get(`/users/${userId}`);
    return response.data.user;
  },

  // Get current user profile
  getProfile: async () => {
    if (USE_MOCK_API) {
      return await mockAPI.getProfile();
    }
    const response = await apiClient.get('/users/profile');
    return response.data.user;
  },

  // Update user profile
  updateProfile: async (userData) => {
    if (USE_MOCK_API) {
      return await mockAPI.updateProfile(userData);
    }
    const response = await apiClient.put('/users/profile', userData);
    return response.data.user;
  },

  // Create new user (admin only)
  createUser: async (userData) => {
    if (USE_MOCK_API) {
      return await mockAPI.createUser(userData);
    }
    const response = await apiClient.post('/users', userData);
    return response.data.user;
  },

  // Update user (admin only)
  updateUser: async (userId, userData) => {
    if (USE_MOCK_API) {
      return await mockAPI.updateUser(userId, userData);
    }
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data.user;
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    if (USE_MOCK_API) {
      return await mockAPI.deleteUser(userId);
    }
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  },

  // Get user roles
  getRoles: async () => {
    const response = await apiClient.get('/users/roles');
    return response.data;
  },

  // Get user departments
  getDepartments: async () => {
    const response = await apiClient.get('/users/departments');
    return response.data;
  },

  // Upload profile picture
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/users/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await apiClient.post('/users/change-password', passwordData);
    return response.data;
  },
};
