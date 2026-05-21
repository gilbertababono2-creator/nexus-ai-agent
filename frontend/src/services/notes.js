import api from './api';

export const fetchNotes = async (userId) => {
  const res = await api.get(`/notes/${userId}`);
  return res.data;
};

export const createNote = async (userId, noteData) => {
  const res = await api.post('/notes', { userId, ...noteData });
  return res.data;
};
