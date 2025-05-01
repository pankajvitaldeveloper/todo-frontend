
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const TodoShow = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState({
        title: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // Fetch todos when component mounts
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchTodos();
        // eslint-disable-next-line
    }, [navigate]);

    const fetchTodos = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await fetch('http://localhost:5000/api/todo', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to fetch todos');
            }
            
            const data = await response.json();
            setTodos(Array.isArray(data.todos) ? data.todos : []); // Fixed: access todos from data object
        } catch (error) {
            console.error('Error fetching todos:', error);
            setError('Could not fetch todos. Please try again.');
            setTodos([]);
        } finally {
            setLoading(false);
        }
    };

    const addTodo = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!newTodo.title.trim() || !newTodo.description.trim()) {
            setError('Title and description are required.');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            
            const response = await fetch('http://localhost:5000/api/todo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newTodo)
            });
            
            if (!response.ok) {
                throw new Error('Failed to add todo');
            }
            
            const data = await response.json();
            // Update the todos array with the new todo from the response
            setTodos([...todos, data.todo]); // Fix: access the todo from data.todo
            setNewTodo({ title: '', description: '' });
            await fetchTodos(); // Refresh the todos list to ensure consistency
        } catch (error) {
            console.error('Error adding todo:', error);
            setError('Could not add todo. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleComplete = async (id, completed) => {
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            
            const response = await fetch(`http://localhost:5000/api/todo/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ completed: !completed })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update todo');
            }

            const updatedData = await response.json();
            setTodos(todos.map(todo => 
                todo._id === id ? { ...todo, ...updatedData.todo } : todo
            ));
        } catch (error) {
            console.error('Error updating todo:', error);
            setError('Could not update todo. Please try again.');
        }
    };

    const deleteTodo = async (id) => {
        if (!window.confirm('Are you sure you want to delete this todo?')) {
            return;
        }

        setError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            
            const response = await fetch(`http://localhost:5000/api/todo/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }
            
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
            setError('Could not delete todo. Please try again.');
        }
    };

    return (
        <div className="pt-20">
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Todo List</h1>
                    <Link to="/todolist" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">
                        See All
                    </Link>
                </div>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}
                
                <form onSubmit={addTodo} className="mb-6 space-y-4">
                    <div>
                        <input
                            type="text"
                            value={newTodo.title}
                            onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                            placeholder="Todo title..."
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <textarea
                            value={newTodo.description}
                            onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
                            placeholder="Todo description..."
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Todo'}
                    </button>
                </form>

                {loading ? (
                    <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : todos.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No todos yet. Add one above!</p>
                ) : (
                    <ul className="space-y-4">
                        {todos.map((todo) => (
                            <li
                                key={todo._id}
                                className="flex items-center justify-between bg-gray-50 p-4 rounded hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={todo.completed}
                                            onChange={() => toggleComplete(todo._id, todo.completed)}
                                            className="h-5 w-5 text-blue-500 rounded cursor-pointer"
                                        />
                                        <div>
                                            <h3 className={`font-semibold ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                                {todo.title}
                                            </h3>
                                            <p className={`text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {todo.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteTodo(todo._id)}
                                    className="ml-4 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete todo"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default TodoShow;
