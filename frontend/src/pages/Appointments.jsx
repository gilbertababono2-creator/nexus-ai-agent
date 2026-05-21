import React from 'react';
import { useAppointments } from '../hooks/useAppointments';
import { useAuth } from '../hooks/useAuth';
import AppointmentItem from '../components/appointments/AppointmentItem';

const Appointments = () => {
  const { user } = useAuth();
  const { appointments, loading, remove } = useAppointments(user?.uid);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Appointments</h1>
      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-400">No appointments scheduled.</p>
      ) : (
        <div className="space-y-2">
          {appointments.map(appointment => (
            <AppointmentItem key={appointment.id} appointment={appointment} onDelete={remove} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
