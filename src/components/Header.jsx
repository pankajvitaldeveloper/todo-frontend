
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <header className="bg-[#d149d3] shadow-md fixed w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4">
        <div className="flex justify-between items-center">
          <div className="logo text-white">
            <Link to="/"><h1 className="text-2xl font-bold tracking-tight">Todo List</h1></Link>
          </div>
          {/* Desktop Menu */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8 text-white font-medium">
              <Link to="/" className="hover:text-gray-300 cursor-pointer transition">Home</Link>
              {!isLoggedIn ? (
                <>
                  <Link to="/login" className="hover:text-gray-300 cursor-pointer transition">Login</Link>
                  <Link to="/register" className="hover:text-gray-300 cursor-pointer transition">Register</Link>
                </>
              ) : (
                <button onClick={handleLogout} className="hover:text-gray-300 cursor-pointer transition">Logout</button>
              )}
            </ul>
          </nav>
          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8h16M4 16h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden mt-2">
            <ul className="flex flex-col bg-black rounded-lg py-2 shadow-lg text-white font-medium">
              <Link to="/" className="px-4 py-2 hover:bg-gray-800 cursor-pointer transition">Home</Link>
              {!isLoggedIn ? (
                <>
                  <Link to="/login" className="px-4 py-2 hover:bg-gray-800 cursor-pointer transition">Login</Link>
                  <Link to="/register" className="px-4 py-2 hover:bg-gray-800 cursor-pointer transition">Register</Link>
                </>
              ) : (
                <button onClick={handleLogout} className="px-4 py-2 hover:bg-gray-800 cursor-pointer transition text-left w-full">Logout</button>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
