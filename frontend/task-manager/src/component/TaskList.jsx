import { format } from 'date-fns';

function TaskList({ tasks, onDelete, onToggleComplete, onEdit }) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task._id} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Category: {task.category}</p>
          <p>Deadline: {task.deadline ? format(new Date(task.deadline), 'PPP') : 'None'}</p>
          <p>Priority: {task.priority}</p>
          <button onClick={() => onToggleComplete(task._id)}>
            {task.completed ? 'Unmark' : 'Mark'} Complete
          </button>
          <button onClick={() => onEdit(task)}>Edit</button>
          <button onClick={() => onDelete(task._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;