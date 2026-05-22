import api from './api';

export const sendMessage = async (userId, message) => {
  const res = await api.post('/api/agents/chat', {userId, message });
  return res.data;
};
