
import React from 'react';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import TaskItem from '../components/tasks/TaskItem';

const Tasks = () => {
  const { user } = useAuth();
  const { tasks, loading, complete } = useTasks(user?.uid);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tasks</h1>
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-400">No tasks yet. Ask Nexus to create one!</p>
      ) : (
        <div className="space-y-2">
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} onComplete={complete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
