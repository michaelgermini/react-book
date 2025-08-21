import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpenIcon,
  CodeBracketIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  UserIcon,
  ArrowRightIcon,
  StarIcon,
  AcademicCapIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const projects = [
    {
      path: '/todo',
      title: 'Todo Application',
      description: 'A comprehensive task management app with CRUD operations, filtering, and local storage.',
      icon: CodeBracketIcon,
      color: 'from-blue-500 to-cyan-500',
      features: ['Add/Edit/Delete tasks', 'Filter by status', 'Local storage', 'Smooth animations']
    },
    {
      path: '/dashboard',
      title: 'Interactive Dashboard',
      description: 'Data visualization dashboard with charts, real-time updates, and responsive design.',
      icon: ChartBarIcon,
      color: 'from-green-500 to-emerald-500',
      features: ['Real-time charts', 'Data filtering', 'Responsive design', 'Dark mode']
    },
    {
      path: '/ecommerce',
      title: 'E-commerce Storefront',
      description: 'Complete shopping experience with product catalog, cart, and checkout flow.',
      icon: ShoppingBagIcon,
      color: 'from-purple-500 to-pink-500',
      features: ['Product catalog', 'Shopping cart', 'Checkout flow', 'State management']
    },
    {
      path: '/portfolio',
      title: 'Portfolio Website',
      description: 'Modern portfolio with Next.js, animations, and professional presentation.',
      icon: UserIcon,
      color: 'from-orange-500 to-red-500',
      features: ['Next.js framework', 'Smooth animations', 'Contact form', 'SEO optimized']
    }
  ];

  const features = [
    {
      icon: AcademicCapIcon,
      title: 'Comprehensive Learning',
      description: 'From React basics to advanced patterns and real-world applications.'
    },
    {
      icon: CodeBracketIcon,
      title: 'Practical Examples',
      description: 'Working code examples and complete project implementations you can study and modify.'
    },
    {
      icon: RocketLaunchIcon,
      title: 'Modern Stack',
      description: 'Latest React 18, TypeScript, Vite, Tailwind CSS, and industry best practices.'
    },
    {
      icon: StarIcon,
      title: 'Production Ready',
      description: 'Enterprise-grade setup with testing, linting, and deployment configurations.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <BookOpenIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              React Book
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              A comprehensive guide to modern React development with practical examples, 
              real-world projects, and industry best practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/todo"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <RocketLaunchIcon className="w-5 h-5" />
                Start Building
              </Link>
              <a
                href="#projects"
                className="px-8 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                View Projects
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose This React Book?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Learn React the right way with practical examples, modern tooling, and real-world projects.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Practical Projects
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Build real-world applications and learn React concepts through hands-on experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <Link to={project.path} className="block p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${project.color} rounded-lg flex items-center justify-center`}>
                      <project.icon className="w-6 h-6 text-white" />
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {project.description}
                  </p>
                  
                  <div className="space-y-2">
                    {project.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Master React?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Start with the Todo app to learn the fundamentals, then progress through more complex projects 
              to build a complete React skill set.
            </p>
            <Link
              to="/todo"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              <RocketLaunchIcon className="w-5 h-5 mr-2" />
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
