import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    localStorage.setItem('username', username);
    navigate('/chat');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Login to Crappy Chat</h1>
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter your username"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;