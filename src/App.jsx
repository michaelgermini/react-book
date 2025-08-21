import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import TodoApp from './pages/TodoApp';
import Dashboard from './pages/Dashboard';
import Ecommerce from './pages/Ecommerce';
import Portfolio from './pages/Portfolio';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/todo" element={<TodoApp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ecommerce" element={<Ecommerce />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
