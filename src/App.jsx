import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Chat from './components/Chat';
import Error from './components/Error';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/error" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;