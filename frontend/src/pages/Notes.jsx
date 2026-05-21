import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchNotes, createNote } from '../services/notes';

const Notes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.uid) loadNotes();
  }, [user]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await fetchNotes(user.uid);
      setNotes(data);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    await createNote(user.uid, { title, content });
    setTitle('');
    setContent('');
    loadNotes();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Notes</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="w-full p-2 rounded bg-gray-700 text-white"
          rows={3}
        />
        <button type="submit" className="bg-blue-600 px-4 py-2 rounded">Add Note</button>
      </form>
      {loading ? (
        <p>Loading notes...</p>
      ) : notes.length === 0 ? (
        <p className="text-gray-400">No notes yet.</p>
      ) : (
        <div className="space-y-2">
          {notes.map(note => (
            <div key={note.id} className="p-3 bg-gray-800 rounded">
              <h3 className="font-bold">{note.title}</h3>
              <p>{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
