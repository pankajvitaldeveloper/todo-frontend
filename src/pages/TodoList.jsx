import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [viewingTodo, setViewingTodo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchTodos();
  }, [navigate]);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/todo`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      } 
      const data = await response.json();
      setTodos(Array.isArray(data.todos) ? data.todos : []);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/todo/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setTodos(todos.filter(todo => todo._id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleEdit = async (todo) => {
    setEditingTodo(todo);
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/todo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editingTodo)
      });
      if (response.ok) {
        setTodos(todos.map(todo => 
          todo._id === id ? editingTodo : todo
        ));
        setEditingTodo(null);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleView = (todo) => {
    setViewingTodo(todo);
    setEditingTodo(null);
  };

  return (
    <div className="pt-20">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">All Todos</h1>
          <Link to="/todos" className='px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors'>
            Go Back
          </Link>
        </div>
        
        <div className="space-y-4">
          {todos.map(todo => (
            <div key={todo._id} className="bg-gray-50 p-4 rounded-lg">
              {editingTodo && editingTodo._id === todo._id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editingTodo.title}
                    onChange={(e) => setEditingTodo({...editingTodo, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                  />
                  <textarea
                    value={editingTodo.description}
                    onChange={(e) => setEditingTodo({...editingTodo, description: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    rows="3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(todo._id)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTodo(null)}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : viewingTodo && viewingTodo._id === todo._id ? (
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 text-sm rounded ${todo.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {todo.completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{todo.title}</h3>
                    <p className="text-gray-600 whitespace-pre-wrap mb-4">{todo.description}</p>
                    <div className="text-sm text-gray-500">
                      <p>Created: {new Date(todo.createdAt).toLocaleString()}</p>
                      <p>Last Updated: {new Date(todo.updatedAt).toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => setViewingTodo(null)}
                      className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-800">{todo.title}</h3>
                        {todo.completed && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">{todo.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(todo)}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(todo)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(todo._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <span>Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
                    <span className="ml-4">Updated: {new Date(todo.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoList;