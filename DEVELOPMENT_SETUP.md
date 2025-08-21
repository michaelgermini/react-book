# React Book - Development Environment Setup

## 🚀 Quick Start

This development environment is designed to support all the examples and projects in the React Book. It includes modern tooling, testing setup, and best practices for React development.

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd ReactBooks
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## 🛠️ Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Testing
- `npm test` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run cypress:open` - Open Cypress for E2E testing
- `npm run cypress:run` - Run Cypress tests headlessly

### Code Quality
- `npm run lint` - Check for linting errors
- `npm run lint:fix` - Fix linting errors automatically
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

### Analysis
- `npm run analyze` - Analyze bundle size and dependencies

### Storybook
- `npm run storybook` - Start Storybook development server
- `npm run build-storybook` - Build Storybook for production

## 📁 Project Structure

```
src/
├── components/     # Reusable React components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions and helpers
├── styles/        # CSS and styling files
├── types/         # TypeScript type definitions
├── pages/         # Page components for routing
├── contexts/      # React context providers
├── api/           # API integration and data fetching
├── App.jsx        # Main application component
├── main.jsx       # Application entry point
└── styles/
    └── index.css  # Global styles and Tailwind CSS
```

## 🎨 Styling

This project uses **Tailwind CSS** for styling with a custom design system:

### Design Tokens
- **Colors**: Primary and secondary color palettes
- **Typography**: Inter font family with proper hierarchy
- **Spacing**: Consistent spacing scale
- **Animations**: Custom animations and transitions

### Component Classes
- `.btn` - Button component with variants
- `.card` - Card component for content containers
- `.input` - Form input styling
- `.textarea` - Textarea styling

## 🧪 Testing

### Unit Testing
- **Jest** for test runner
- **React Testing Library** for component testing
- **Testing utilities** for common testing patterns

### E2E Testing
- **Cypress** for end-to-end testing
- **Custom commands** for common testing scenarios

### Test Structure
```
src/
├── __tests__/           # Test files
├── components/
│   └── __tests__/       # Component-specific tests
└── setupTests.js        # Test setup and configuration
```

## 📦 Dependencies

### Core Dependencies
- **React 18** - Latest React with concurrent features
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Zustand** - Lightweight state management
- **Styled Components** - CSS-in-JS styling

### Development Dependencies
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type safety
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Cypress** - E2E testing

## 🔧 Configuration Files

- `vite.config.js` - Vite configuration with aliases
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.js` - ESLint rules and plugins
- `.prettierrc` - Prettier formatting rules
- `jest.config.js` - Jest testing configuration

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_API_KEY=your_api_key_here

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG_MODE=false

# External Services
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 📚 Learning Resources

This development environment supports all the examples and projects from the React Book chapters:

1. **Chapter 1-2**: Basic React concepts and setup
2. **Chapter 3**: State management examples
3. **Chapter 4**: Styling with Tailwind and Styled Components
4. **Chapter 5**: API integration with React Query
5. **Chapter 6**: Testing with Jest and Cypress
6. **Chapter 7**: Performance optimization
7. **Chapter 8**: Deployment and CI/CD
8. **Chapter 9**: Practical projects (Todo, Dashboard, E-commerce, Portfolio)
9. **Chapter 10**: Advanced topics and future React features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy coding! 🚀**
