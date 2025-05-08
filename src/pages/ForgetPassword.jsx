import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forget-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),// json.stringify({ email }) is a method in JavaScript that converts a JavaScript object into a JSON string. It is commonly used when sending data to a server or storing data in a file.
      });

      const data = await response.json();

      if (response.ok) {
        alert('Password reset instructions sent to your email!');
        navigate('/login');
      } else {
        alert(data.message || 'Failed to process request');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Forgot Password</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Send Reset Instructions
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;