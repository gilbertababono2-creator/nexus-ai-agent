import React from 'react';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`mb-2 ${isUser ? 'text-right' : 'text-left'}`}>
      <span className={`inline-block p-2 rounded max-w-[70%] ${isUser ? 'bg-blue-600' : 'bg-gray-700'}`}>
        {message.content}
      </span>
    </div>
  );
};

export default ChatMessage;
