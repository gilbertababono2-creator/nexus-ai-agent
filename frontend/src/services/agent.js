import api from './api';

export const sendMessage = async (db,userId, message) => {
  const res = await api.post('/api/agents/chat', {db,userId, message });
  return res.data;
};
