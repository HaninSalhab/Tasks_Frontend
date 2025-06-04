import React, { useState } from 'react';
import axios from '../api/axios';

interface AddTaskFormProps {
  onTaskAdded: () => void; 
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await axios.post('/Task', {
        title,
        description,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setTitle('');
      setDescription('');
      onTaskAdded();
    } catch (err) {
      setError('Failed to add task');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <div>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={loading}
        />
      </div>
      <div>
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          disabled={loading}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
};

export default AddTaskForm;
