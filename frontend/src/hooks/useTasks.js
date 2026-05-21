import { useState, useEffect } from 'react';
import { fetchTasks, completeTask } from '../services/tasks';

export const useTasks = (userId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await fetchTasks(userId);
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const complete = async (taskId) => {
    await completeTask(taskId);
    await loadTasks();
  };

  useEffect(() => {
    if (userId) loadTasks();
  }, [userId]);

  return { tasks, loading, complete, refresh: loadTasks };
};
