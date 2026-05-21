import React, { useState } from 'react';

const ChatInput = ({ onSend, disabled }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        className="flex-1 p-2 rounded bg-gray-700 text-white"
        placeholder="Type a message..."
      />
      <button type="submit" disabled={disabled} className="bg-blue-600 px-4 py-2 rounded">
        Send
      </button>
    </form>
  );
};

export default ChatInput;
