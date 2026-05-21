
import api from './api';

export const fetchTasks = async (userId) => {
  const res = await api.get(`/tasks/${userId}`);
  return res.data;
};

export const completeTask = async (taskId) => {
  const res = await api.post(`/tasks/complete/${taskId}`);
  return res.data;
};
