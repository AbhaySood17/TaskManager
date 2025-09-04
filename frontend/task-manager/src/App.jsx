import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './component/TaskList';
import TaskForm from './component/TaskForm';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [sortBy, setSortBy] = useState('priority'); // 'priority' | 'deadline'

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleCreateOrUpdate = async (task) => {
    try {
      if (editingTask) {
        await axios.put(`http://localhost:5000/api/tasks/${editingTask._id}`, task);
      } else {
        await axios.post('http://localhost:5000/api/tasks', task);
      }
      fetchTasks();
      setEditingTask(null);
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${id}/complete`);
      fetchTasks();
    } catch (err) {
      console.error('Error toggling complete:', err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const getPriorityRank = (priority) => {
    if (priority === 'High') return 3;
    if (priority === 'Medium') return 2;
    if (priority === 'Low') return 1;
    return 0;
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'priority') {
      // Higher priority first
      return getPriorityRank(b.priority) - getPriorityRank(a.priority);
    }
    if (sortBy === 'deadline') {
      const aTime = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const bTime = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      // Sooner deadlines first; items without deadlines go last
      return aTime - bTime;
    }
    return 0;
  });

  return (
    <div className="app">
      <h1 className="app-title">
        <svg className="flower-icon" width="36" height="36" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <g fill="currentColor">
            <circle cx="12" cy="12" r="3"/>
            <circle cx="12" cy="4.5" r="2.5"/>
            <circle cx="12" cy="19.5" r="2.5"/>
            <circle cx="4.5" cy="12" r="2.5"/>
            <circle cx="19.5" cy="12" r="2.5"/>
            <circle cx="7.5" cy="7.5" r="2"/>
            <circle cx="16.5" cy="7.5" r="2"/>
            <circle cx="7.5" cy="16.5" r="2"/>
            <circle cx="16.5" cy="16.5" r="2"/>
          </g>
        </svg>
        Task Manager
        <svg className="flower-icon" width="36" height="36" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <g fill="currentColor">
            <circle cx="12" cy="12" r="3"/>
            <circle cx="12" cy="4.5" r="2.5"/>
            <circle cx="12" cy="19.5" r="2.5"/>
            <circle cx="4.5" cy="12" r="2.5"/>
            <circle cx="19.5" cy="12" r="2.5"/>
            <circle cx="7.5" cy="7.5" r="2"/>
            <circle cx="16.5" cy="7.5" r="2"/>
            <circle cx="7.5" cy="16.5" r="2"/>
            <circle cx="16.5" cy="16.5" r="2"/>
          </g>
        </svg>
      </h1>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
        <label htmlFor="sortBy">Sort by:</label>
        <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="priority">Priority (High → Low)</option>
          <option value="deadline">Deadline (Soonest → Latest)</option>
        </select>
      </div>

      <TaskForm onSubmit={handleCreateOrUpdate} editingTask={editingTask} />
      <TaskList
        tasks={sortedTasks}
        onDelete={handleDelete}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEdit}
      />
    </div>
  );
}

export default App;