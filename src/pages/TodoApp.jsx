import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  PlusIcon, 
  TrashIcon, 
  PencilIcon, 
  CheckIcon,
  XMarkIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newTodo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        priority: 'medium'
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
      toast.success('Todo added successfully!');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast.success('Todo deleted!');
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditValue(todo.text);
  };

  const saveEdit = (id) => {
    if (editValue.trim()) {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, text: editValue.trim() } : todo
      ));
      setEditingId(null);
      setEditValue('');
      toast.success('Todo updated!');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
    toast.success('Completed todos cleared!');
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const stats = {
    total: todos.length,
    active: todos.filter(todo => !todo.completed).length,
    completed: todos.filter(todo => todo.completed).length
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo App</h1>
        <p className="text-gray-600">Organize your tasks efficiently</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div 
          className="bg-white p-4 rounded-lg shadow-sm border"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </motion.div>
        <motion.div 
          className="bg-white p-4 rounded-lg shadow-sm border"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-2xl font-bold text-yellow-600">{stats.active}</div>
          <div className="text-sm text-gray-600">Active</div>
        </motion.div>
        <motion.div 
          className="bg-white p-4 rounded-lg shadow-sm border"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </motion.div>
      </div>

      {/* Add Todo Form */}
      <motion.form 
        onSubmit={addTodo}
        className="bg-white p-6 rounded-lg shadow-sm border mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add
          </button>
        </div>
      </motion.form>

      {/* Filters */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {['all', 'active', 'completed'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === filterType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
        {stats.completed > 0 && (
          <button
            onClick={clearCompleted}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Clear Completed
          </button>
        )}
      </div>

      {/* Todo List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <AnimatePresence>
          {filteredTodos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`border-b last:border-b-0 ${
                todo.completed ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <div className="p-4 flex items-center gap-3">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    todo.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                >
                  {todo.completed && <CheckIcon className="w-4 h-4" />}
                </button>

                {editingId === todo.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEdit(todo.id)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                      <CheckIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <span
                    className={`flex-1 ${
                      todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}
                  >
                    {todo.text}
                  </span>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(todo)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTodos.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <FunnelIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No todos found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoApp;
