import React from 'react';
import { formatDate, formatTime } from '../../utils/formatDate';

const AppointmentItem = ({ appointment, onDelete }) => {
  return (
    <div className="p-3 bg-gray-800 rounded flex justify-between items-center">
      <div>
        <p className="font-bold">{appointment.title}</p>
        <p className="text-sm text-gray-400">
          {formatDate(appointment.date)} at {formatTime(appointment.time)}
        </p>
      </div>
      <button
        onClick={() => onDelete(appointment.id)}
        className="bg-red-600 px-2 py-1 text-sm rounded"
      >
        Delete
      </button>
    </div>
  );
};

export default AppointmentItem;
