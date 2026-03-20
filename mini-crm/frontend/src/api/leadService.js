import apiClient from './apiClient';

export const getLeads = async () => {
  const response = await apiClient.get('/leads');
  return response.data;
};

export const createLead = async (leadData) => {
  const response = await apiClient.post('/leads', leadData);
  return response.data;
};

export const updateLead = async (id, leadData) => {
  const response = await apiClient.put(`/leads/${id}`, leadData);
  return response.data;
};

export const deleteLead = async (id) => {
  const response = await apiClient.delete(`/leads/${id}`);
  return response.data;
};
