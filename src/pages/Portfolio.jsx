import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const Portfolio = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const skills = [
    { name: 'React', level: 95, color: '#61DAFB' },
    { name: 'JavaScript', level: 90, color: '#F7DF1E' },
    { name: 'TypeScript', level: 85, color: '#3178C6' },
    { name: 'Node.js', level: 80, color: '#339933' },
    { name: 'Python', level: 75, color: '#3776AB' },
    { name: 'SQL', level: 85, color: '#336791' }
  ];

  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'A full-stack e-commerce platform built with React, Node.js, and MongoDB.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      link: '#',
      github: '#'
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
      technologies: ['React', 'Firebase', 'Material-UI'],
      link: '#',
      github: '#'
    },
    {
      id: 3,
      title: 'Weather Dashboard',
      description: 'A weather application with interactive charts and location-based forecasts.',
      image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=400&h=300&fit=crop',
      technologies: ['React', 'Chart.js', 'OpenWeather API'],
      link: '#',
      github: '#'
    }
  ];

  const experiences = [
    {
      company: 'TechCorp',
      position: 'Senior Frontend Developer',
      period: '2022 - Present',
      description: 'Led development of multiple React applications, mentored junior developers, and implemented best practices.'
    },
    {
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      period: '2020 - 2022',
      description: 'Built and maintained web applications using React, Node.js, and PostgreSQL.'
    },
    {
      company: 'Digital Agency',
      position: 'Frontend Developer',
      period: '2018 - 2020',
      description: 'Developed responsive websites and web applications for various clients.'
    }
  ];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast.success('Message sent successfully! I\'ll get back to you soon.');
    setContactForm({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Hero Section */}
      <section className="text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden border-4 border-blue-500">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            John Doe
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Full Stack Developer & UI/UX Enthusiast
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            I create beautiful, functional, and user-friendly web applications. 
            Passionate about clean code, modern technologies, and exceptional user experiences.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="#contact"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get In Touch
            </a>
            <a
              href="#projects"
              className="px-8 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              View Projects
            </a>
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section className="py-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Skills & Technologies
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Here are the technologies I work with on a daily basis
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {skill.name}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {skill.level}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="h-2 rounded-full"
                  style={{ backgroundColor: skill.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Here are some of my recent projects
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-4">
                  <a
                    href={project.link}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Live Demo
                  </a>
                  <a
                    href={project.github}
                    className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Experience
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            My professional journey
          </p>
        </motion.div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {exp.position}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    {exp.company}
                  </p>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {exp.period}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {exp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Get In Touch
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Let's work together on your next project
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600 dark:text-gray-300">
                  john.doe@example.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600 dark:text-gray-300">
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPinIcon className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600 dark:text-gray-300">
                  San Francisco, CA
                </span>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Follow Me
              </h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <GlobeAltIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <GlobeAltIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <GlobeAltIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            onSubmit={handleContactSubmit}
            className="space-y-4"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={contactForm.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={contactForm.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={contactForm.message}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <CheckIcon className="w-5 h-5 mr-2" />
                  Send Message
                </>
              )}
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
