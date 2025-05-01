import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    const token = localStorage.getItem('token');
    const isAuthenticated = () => !!token; // Check if token exists
    if (isAuthenticated()) {
      navigate('/todos');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-500 to-pink-500">
      <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4">Let's Start Your Todo List</h1>
        <p className="mb-6 text-gray-600">Organize your tasks effortlessly</p>
        <button
          onClick={handleStart}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
