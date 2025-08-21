import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  SunIcon, 
  MoonIcon,
  BookOpenIcon,
  CodeBracketIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const location = useLocation();
  const [isDark, setIsDark] = React.useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const navItems = [
    { path: '/', label: 'Home', icon: BookOpenIcon },
    { path: '/todo', label: 'Todo App', icon: CodeBracketIcon },
    { path: '/dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { path: '/ecommerce', label: 'E-commerce', icon: ShoppingBagIcon },
    { path: '/portfolio', label: 'Portfolio', icon: UserIcon },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <BookOpenIcon className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              React Book
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            {isDark ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
