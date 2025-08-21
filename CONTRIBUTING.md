# 🤝 Contributing to React Book

Thank you for your interest in contributing to React Book! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guides](#style-guides)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## 🎯 How Can I Contribute?

### 🐛 Reporting Bugs

- Use the GitHub issue tracker
- Include detailed steps to reproduce the bug
- Provide your operating system and browser information
- Include screenshots if applicable

### 💡 Suggesting Enhancements

- Use the GitHub issue tracker
- Describe the enhancement clearly
- Explain why this enhancement would be useful
- Include mockups or examples if possible

### 📝 Improving Documentation

- Fix typos and grammar errors
- Add missing information
- Improve code examples
- Update outdated content

### 🔧 Code Contributions

- Fix bugs
- Add new features
- Improve performance
- Add tests
- Refactor code

## 🛠️ Development Setup

### Prerequisites

- Node.js 16+
- npm or yarn
- Git

### Setup Steps

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/yourusername/react-book.git
   cd react-book
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm run test
   ```

5. **Check code quality**
   ```bash
   npm run lint
   npm run type-check
   ```

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure tests pass**
   ```bash
   npm run test
   npm run test:coverage
   ```

2. **Check code quality**
   ```bash
   npm run lint
   npm run lint:fix
   npm run format
   npm run type-check
   ```

3. **Update documentation**
   - Update README.md if needed
   - Add JSDoc comments for new functions
   - Update chapter content if applicable

### Pull Request Guidelines

1. **Create a descriptive title**
   - Use present tense ("Add feature" not "Added feature")
   - Use imperative mood ("Move cursor to..." not "Moves cursor to...")
   - Limit the first line to 72 characters or less

2. **Provide a detailed description**
   - What does this PR do?
   - Why is this change needed?
   - How was it tested?
   - Screenshots for UI changes

3. **Reference issues**
   - Link to related issues using `#issue-number`
   - Use keywords like "Fixes #123" or "Closes #456"

4. **Keep PRs focused**
   - One feature or bug fix per PR
   - Keep changes small and manageable
   - Split large changes into multiple PRs

## 📏 Style Guides

### JavaScript/TypeScript

- Use **ESLint** and **Prettier** configurations
- Follow **TypeScript** best practices
- Use **functional components** with hooks
- Prefer **const** over **let**
- Use **arrow functions** for consistency

### React

- Use **functional components**
- Implement **proper prop types**
- Use **custom hooks** for reusable logic
- Follow **React naming conventions**
- Use **JSX** consistently

### CSS/Styling

- Use **Tailwind CSS** utility classes
- Follow **BEM methodology** for custom CSS
- Use **CSS variables** for theming
- Ensure **responsive design**
- Maintain **accessibility standards**

### Git Commit Messages

- Use **conventional commits** format
- Format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Example: `feat(dashboard): add sales chart component`

## 🐛 Reporting Bugs

### Before Creating Bug Reports

- Check existing issues for duplicates
- Try to reproduce the bug in the latest version
- Check if the bug is browser-specific

### Bug Report Template

```markdown
**Bug Description**
A clear and concise description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- OS: [e.g. Windows 10, macOS 12.0]
- Browser: [e.g. Chrome 96, Firefox 95]
- Node.js version: [e.g. 16.13.0]

**Screenshots**
If applicable, add screenshots to help explain the problem.

**Additional Context**
Add any other context about the problem here.
```

## 💡 Suggesting Enhancements

### Enhancement Request Template

```markdown
**Enhancement Description**
A clear and concise description of the enhancement.

**Problem Statement**
What problem does this enhancement solve?

**Proposed Solution**
A clear and concise description of what you want to happen.

**Alternative Solutions**
A clear and concise description of any alternative solutions you've considered.

**Additional Context**
Add any other context or screenshots about the enhancement request here.
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run cypress:run
```

### Writing Tests

- Write tests for new features
- Ensure good test coverage
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for functions
- Document complex algorithms
- Include usage examples
- Keep documentation up to date

### Chapter Content

- Write clear, concise explanations
- Include practical examples
- Add exercises and challenges
- Keep content current with React versions

## 🎉 Recognition

Contributors will be recognized in:

- **README.md** contributors section
- **GitHub** contributors page
- **Release notes** for significant contributions

## 📞 Getting Help

If you need help with contributing:

- Check existing issues and discussions
- Ask questions in GitHub Discussions
- Contact maintainers via email
- Join our community chat (if available)

## 🙏 Thank You

Thank you for contributing to React Book! Your contributions help make this project better for everyone in the React community.

---

**Happy coding! 🚀**
