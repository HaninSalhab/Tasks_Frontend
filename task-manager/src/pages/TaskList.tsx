import React, { useEffect, useState } from 'react';
import {
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography
} from '@mui/material';
import Header from "../components/Header";
import axios from '../api/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  modifiedAt: string;
  userId: number;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterCompleted, setFilterCompleted] = useState<'all' | 'completed' | 'notCompleted'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
const [selectedTask, setSelectedTask] = useState<Task | null>(null);
const [updateTitle, setUpdateTitle] = useState('');
const [updateDescription, setUpdateDescription] = useState('');

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to view tasks.');
      return;
    }

    try {
      const response = await axios.get('/Task', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    }
  };
const handleOpenUpdateDialog = (task: Task) => {
  setSelectedTask(task);
  setUpdateTitle(task.title);
  setUpdateDescription(task.description);
  setOpenUpdateDialog(true);
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleComplete = async (taskId: number, task: Task) => {
    const token = localStorage.getItem('token');
    try {
      const updatedTask = { ...task, completed: true };
      await axios.put(`/Task/${taskId}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Task marked as completed');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to complete task');
    }
  };

  const handleDelete = async (taskId: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/Task/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Task deleted successfully');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  
const handleUpdateTask = async () => {
  if (!selectedTask) return;

  if (!updateTitle.trim() || updateTitle.length < 3) {
    toast.error('Title must be at least 3 characters');
    return;
  }

  if (updateDescription.length > 500) {
    toast.error('Description is too long');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    toast.error('You must be logged in to update a task');
    return;
  }

  try {
    const updatedTask = {
      ...selectedTask,
      title: updateTitle,
      description: updateDescription,
    };
    await axios.put(`/Task/${selectedTask.id}`, updatedTask, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success('Task updated successfully');
    setOpenUpdateDialog(false);
    fetchTasks();
  } catch (error) {
    toast.error('Failed to update task');
  }
};


  const handleAddTask = async () => {
    if (!title.trim() || title.length < 3) {
      toast.error('Title must be at least 3 characters');
      return;
    }
    if (description.length > 500) {
      toast.error('Description is too long');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to add a task');
      return;
    }

    try {
      await axios.post(
        '/Task',
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Task added successfully');
      setTitle('');
      setDescription('');
      setOpenDialog(false);
      fetchTasks();
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const user = localStorage.getItem('user')?.toString() || 'Unknown User';
const filteredAndSortedTasks = tasks
  .filter((task) => {
    if (filterCompleted === 'completed') return task.completed;
    if (filterCompleted === 'notCompleted') return !task.completed;
    return true;
  })
  .sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Header username={user} onLogout={handleLogout} />
      <br></br>
      <Typography variant="h5" gutterBottom>
        My Future Steps
      </Typography>

      <Button variant="contained" sx={{ mb: 2 }} onClick={() => setOpenDialog(true)}>
        Add New
      </Button>
{}
<Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
  <TextField
    select
    label="Filter by Status"
    value={filterCompleted}
    onChange={(e) => setFilterCompleted(e.target.value as 'all' | 'completed' | 'notCompleted')}
    SelectProps={{ native: true }}
    variant="outlined"
    size="small"
  >
    <option value="all">All</option>
    <option value="completed">Completed</option>
    <option value="notCompleted">Not Completed</option>
  </TextField>

  <TextField
    select
    label="Sort by Date"
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
    SelectProps={{ native: true }}
    variant="outlined"
    size="small"
  >
    <option value="desc">Newest First</option>
    <option value="asc">Oldest First</option>
  </TextField>
</Box>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#bbdefb' }}>
            <TableCell sx={{ fontWeight: 'bold', color: '#003366' }}>Title</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#003366' }}>Description</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#003366' }}>Completed</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#003366' }}>Assigned User</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#003366' }}>Created At</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#003366' }}>Modified At</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#003366' }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredAndSortedTasks.map((task) => (
            <TableRow key={task.id} sx={{ backgroundColor: task.completed ? '#e8f5e9' : 'inherit' }}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>{task.completed ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                {task.user.firstName} {task.user.lastName} ({task.user.email})
              </TableCell>
              <TableCell>{new Date(task.createdAt).toLocaleString()}</TableCell>
              <TableCell>{task.modifiedAt ? new Date(task.modifiedAt).toLocaleString() : null}</TableCell>
              <TableCell align="center">
                {!task.completed && (
                  <Button
                    size="small"
                    color="success"
                    onClick={() => handleComplete(task.id, task)}
                    sx={{ mr: 1 }}
                  >
                    Complete
                  </Button>
                )}
                <Button size="small" color="error" onClick={() => handleDelete(task.id)}>
                  Delete
                </Button>
                <Button size="small" color="primary" onClick={() => handleOpenUpdateDialog(task)}>
                  Update
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddTask}>
            Add Task
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} fullWidth maxWidth="sm">
  <DialogTitle>Update Task</DialogTitle>
  <DialogContent>
    <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
      <TextField
        label="Title"
        value={updateTitle}
        onChange={(e) => setUpdateTitle(e.target.value)}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Description"
        value={updateDescription}
        onChange={(e) => setUpdateDescription(e.target.value)}
        fullWidth
        multiline
        rows={3}
        margin="normal"
      />
    </Box>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenUpdateDialog(false)}>Cancel</Button>
    <Button variant="contained" onClick={handleUpdateTask}>
      Update
    </Button>
  </DialogActions>
</Dialog>


      {}
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar />
    </Container>
  );
};

export default TaskList;
