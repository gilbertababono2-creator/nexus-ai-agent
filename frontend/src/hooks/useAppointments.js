import { useState, useEffect } from 'react';
import { fetchAppointments, deleteAppointment } from '../services/appointments';

export const useAppointments = (userId) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await fetchAppointments(userId);
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (appointmentId) => {
    await deleteAppointment(appointmentId);
    await loadAppointments();
  };

  useEffect(() => {
    if (userId) loadAppointments();
  }, [userId]);

  return { appointments, loading, remove, refresh: loadAppointments };
};
