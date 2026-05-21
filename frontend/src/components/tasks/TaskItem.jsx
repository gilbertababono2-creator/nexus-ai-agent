import React from 'react';

const TaskItem = ({ task, onComplete }) => {
  const priorityColors = {
    high: 'text-red-400',
    medium: 'text-yellow-400',
    low: 'text-green-400'
  };

  return (
    <div className={`p-3 bg-gray-800 rounded flex justify-between items-center ${task.completed ? 'opacity-50 line-through' : ''}`}>
      <div>
        <p>{task.task}</p>
        <span className={`text-xs ${priorityColors[task.priority] || 'text-gray-400'}`}>
          {task.priority || 'normal'}
        </span>
      </div>
      {!task.completed && (
        <button
          onClick={() => onComplete(task.id)}
          className="bg-green-600 px-2 py-1 text-sm rounded"
        >
          Done
        </button>
      )}
    </div>
  );
};

export default TaskItem;
