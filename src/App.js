import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import './App.css';

function App() {
  return (
    <div>
      <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lobby/:id" element={<Lobby />} />
      </Routes>
      </Router>
    </div>
  );
}

export default App;
