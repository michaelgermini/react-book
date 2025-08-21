import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);

  // Simulated data
  const salesData = [
    { name: 'Jan', sales: 4000, orders: 2400, users: 2400 },
    { name: 'Feb', sales: 3000, orders: 1398, users: 2210 },
    { name: 'Mar', sales: 2000, orders: 9800, users: 2290 },
    { name: 'Apr', sales: 2780, orders: 3908, users: 2000 },
    { name: 'May', sales: 1890, orders: 4800, users: 2181 },
    { name: 'Jun', sales: 2390, orders: 3800, users: 2500 },
    { name: 'Jul', sales: 3490, orders: 4300, users: 2100 },
  ];

  const pieData = [
    { name: 'Desktop', value: 400, color: '#8884d8' },
    { name: 'Mobile', value: 300, color: '#82ca9d' },
    { name: 'Tablet', value: 200, color: '#ffc658' },
    { name: 'Other', value: 100, color: '#ff7300' },
  ];

  const recentOrders = [
    { id: 1, customer: 'John Doe', product: 'Laptop', amount: 1200, status: 'completed' },
    { id: 2, customer: 'Jane Smith', product: 'Phone', amount: 800, status: 'pending' },
    { id: 3, customer: 'Bob Johnson', product: 'Tablet', amount: 600, status: 'completed' },
    { id: 4, customer: 'Alice Brown', product: 'Headphones', amount: 150, status: 'cancelled' },
    { id: 5, customer: 'Charlie Wilson', product: 'Monitor', amount: 300, status: 'pending' },
  ];

  const stats = [
    {
      title: 'Total Sales',
      value: '$45,231',
      change: '+20.1%',
      changeType: 'positive',
      icon: CurrencyDollarIcon,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Total Orders',
      value: '2,350',
      change: '+15.3%',
      changeType: 'positive',
      icon: ShoppingBagIcon,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: '-2.1%',
      changeType: 'negative',
      icon: UsersIcon,
      color: 'from-purple-500 to-pink-500'
    },
                {
              title: 'Conversion Rate',
              value: '3.24%',
              change: '+8.7%',
              changeType: 'positive',
              icon: EyeIcon,
              color: 'from-orange-500 to-red-500'
            }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Monitor your business metrics and performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              {stat.changeType === 'positive' ? (
                <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                from last month
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sales Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stackId="1" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="orders" 
                stackId="1" 
                stroke="#82ca9d" 
                fill="#82ca9d" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Traffic Sources */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Traffic Sources
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Users Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Orders Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Orders
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Orders
          </h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View all
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Product
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    #{order.id}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {order.customer}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {order.product}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    ${order.amount}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
