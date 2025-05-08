import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    // below code is used to set the value of the input field and set the value of the formData state
    const {name, value} = e.target;
    setFormData((prev)=>({
        // prev is the previous state of the formData state
        ...prev,// this is used to copy the previous state of the formData state
        // below code is used to set the value of the input field
        [name]: value,
    }))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),// json.stringify is used to convert the formData state into a string and send it to the server
      });

      const result = await response.json();
  
      if (response.ok) {
        alert("Registration successful!");
        console.log(result);
        navigate("/login"); // Changed from navigator to navigate
      } else {
        alert(`Registration failed: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while registering.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Login here
            </Link>
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default Register;
