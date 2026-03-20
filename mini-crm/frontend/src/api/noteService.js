import apiClient from './apiClient';

export const getLeadNotes = async (leadId) => {
  const response = await apiClient.get(`/notes/${leadId}`);
  return response.data;
};

export const addNote = async (leadId, note) => {
  const response = await apiClient.post(`/notes/${leadId}`, { note });
  return response.data;
};
