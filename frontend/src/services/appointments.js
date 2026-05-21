import api from './api';

export const fetchAppointments = async (userId) => {
  const res = await api.get(`/appointments/${userId}`);
  return res.data;
};

export const deleteAppointment = async (appointmentId) => {
  const res = await api.delete(`/appointments/${appointmentId}`);
  return res.data;
};
