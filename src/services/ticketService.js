import apiClient from './api';
import { mockAPI } from './mockAPI';

// Toggle this to use mock API (true) or real API (false)
const USE_MOCK_API = false;

export const ticketService = {
  // Get all tickets
  getAllTickets: async (params) => {
    if (USE_MOCK_API) {
      return await mockAPI.getTickets();
    }
    const response = await apiClient.get('/tickets', { params });
    return { tickets: response.data.tickets };
  },

  // Get ticket by ID
  getTicketById: async (ticketId) => {
    if (USE_MOCK_API) {
      return await mockAPI.getTicketById(ticketId);
    }
    const response = await apiClient.get(`/tickets/${ticketId}`);
    return response.data.ticket;
  },

  // Create new ticket
  createTicket: async (ticketData) => {
    if (USE_MOCK_API) {
      return await mockAPI.createTicket(ticketData);
    }
    const response = await apiClient.post('/tickets', ticketData);
    return { ticket: response.data.ticket };
  },

  // Update ticket
  updateTicket: async (ticketId, updates) => {
    if (USE_MOCK_API) {
      return await mockAPI.updateTicket(ticketId, updates);
    }
    const response = await apiClient.put(`/tickets/${ticketId}`, updates);
    return response.data.ticket;
  },



  // Assign ticket
  assignTicket: async (ticketId, userId) => {
    const response = await apiClient.post(`/tickets/${ticketId}/assign`, { userId });
    return response.data;
  },

  // Update ticket status
  updateStatus: async (ticketId, status) => {
    const response = await apiClient.patch(`/tickets/${ticketId}/status`, { status });
    return response.data;
  },

  // Update ticket priority
  updatePriority: async (ticketId, priority) => {
    const response = await apiClient.patch(`/tickets/${ticketId}/priority`, { priority });
    return response.data;
  },

  // Add comment to ticket
  addComment: async (ticketId, comment) => {
    if (USE_MOCK_API) {
      return await mockAPI.addComment(ticketId, comment);
    }
    const response = await apiClient.post(`/tickets/${ticketId}/comments`, comment);
    return response.data;
  },

  // Get ticket comments
  getComments: async (ticketId) => {
    if (USE_MOCK_API) {
      return await mockAPI.getComments(ticketId);
    }
    const response = await apiClient.get(`/tickets/${ticketId}/comments`);
    return response.data.comments || [];
  },

  // Upload attachment
  uploadAttachment: async (ticketId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/tickets/${ticketId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get ticket history
  getTicketHistory: async (ticketId) => {
    const response = await apiClient.get(`/tickets/${ticketId}/history`);
    return response.data;
  },

  // Get user's tickets
  getMyTickets: async (params) => {
    if (USE_MOCK_API) {
      return await mockAPI.getTickets();
    }
    const response = await apiClient.get('/tickets/my-tickets', { params });
    return { tickets: response.data.tickets };
  },

  // Get assigned tickets
  getAssignedTickets: async (params) => {
    const response = await apiClient.get('/tickets/assigned', { params });
    return { tickets: response.data.tickets };
  },
};
