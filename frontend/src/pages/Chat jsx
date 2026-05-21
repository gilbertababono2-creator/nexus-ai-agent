import React, { useState } from 'react';
import { useAgentChat } from '../hooks/useAgentChat';
import { useAuth } from '../hooks/useAuth';

const Chat = () => {
  const { user } = useAuth();
  const { messages, send, loading } = useAgentChat(user?.uid || 'guest');
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      send(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[80vh] p-6">
      <div className="flex-1 overflow-y-auto border p-4 rounded bg-gray-800 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded max-w-[70%] ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
              {msg.content}
            </span>
          </div>
        ))}
        {loading && <div className="text-gray-400">Nexus is thinking...</div>}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-700 text-white"
          placeholder="Talk to Nexus..."
        />
        <button type="submit" className="bg-blue-600 px-4 py-2 rounded">Send</button>
      </form>
    </div>
  );
};

export default Chat;
