import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const userId = 'test-user-123';

  useEffect(() => {
    fetchTasks();
    fetchAppointments();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/api/tasks/${userId}`);
      setTasks(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`/api/appointments/${userId}`);
      setAppointments(res.data);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/agents/chat', { userId, message });
      setResponse(res.data.response || res.data.message);
      setMessage('');
      fetchTasks();
      fetchAppointments();
    } catch (error) {
      setResponse('Error: ' + error.message);
    }
    setLoading(false);
  };

  const completeTask = async (taskId) => {
    try {
      await axios.post(`/api/tasks/complete/${taskId}`);
      fetchTasks();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">🧠 Nexus AI Agent</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Chat */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">💬 Talk to Nexus</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me to schedule, create tasks, store notes, search..."
                className="w-full p-3 rounded bg-gray-700 text-white border-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-medium transition"
              >
                {loading ? '🧠 Thinking...' : 'Send'}
              </button>
            </form>
            {response && (
              <div className="mt-4 p-4 bg-gray-700 rounded border-l-4 border-blue-400">
                <p className="whitespace-pre-wrap">{response}</p>
              </div>
            )}
          </div>

          {/* Dashboard */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">📋 Tasks</h3>
              {tasks.length === 0 ? (
                <p className="text-gray-400 text-sm">No tasks yet</p>
              ) : (
                <ul className="space-y-2">
                  {tasks.slice(0, 5).map(t => (
                    <li key={t.id} className={`flex justify-between items-center p-2 bg-gray-700 rounded ${t.completed ? 'opacity-50 line-through' : ''}`}>
                      <span>{t.task} <span className="text-xs text-gray-400">({t.priority})</span></span>
                      {!t.completed && (
                        <button onClick={() => completeTask(t.id)} className="text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded">Done</button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">📅 Appointments</h3>
              {appointments.length === 0 ? (
                <p className="text-gray-400 text-sm">No appointments</p>
              ) : (
                <ul className="space-y-2">
                  {appointments.slice(0, 3).map(a => (
                    <li key={a.id} className="p-2 bg-gray-700 rounded flex justify-between">
                      <span>{a.title}</span>
                      <span className="text-xs text-gray-400">{a.date} at {a.time}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
