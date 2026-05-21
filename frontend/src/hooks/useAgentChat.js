
import { useState } from 'react';
import { sendMessage } from '../services/agent';

export const useAgentChat = (userId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const send = async (content) => {
    setLoading(true);
    const newMessage = { role: 'user', content };
    setMessages(prev => [...prev, newMessage]);

    try {
      const data = await sendMessage(userId, content);
      const reply = { role: 'assistant', content: data.response || data.message };
      setMessages(prev => [...prev, reply]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + error.message }]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, send, loading };
};
