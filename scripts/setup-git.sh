#!/bin/bash

# React Book - Git Setup Script
# This script helps set up the Git repository for GitHub publication

echo "🚀 Setting up Git repository for React Book..."

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Initialize Git repository (if not already initialized)
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
else
    echo "✅ Git repository already initialized"
fi

# Add all files to staging
echo "📝 Adding files to staging..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "feat: initial commit - React Book with interactive projects

- Complete React learning guide with 10+ chapters
- Interactive projects: Todo, Dashboard, E-commerce, Portfolio
- Modern tech stack: Vite, Tailwind CSS, Framer Motion
- Comprehensive testing setup with Jest and Cypress
- CI/CD pipeline with GitHub Actions
- Professional documentation and contribution guidelines"

# Add remote origin (user will need to update this)
echo "🔗 Adding remote origin..."
echo "Please update the remote URL with your GitHub repository:"
echo "git remote set-url origin https://github.com/YOUR_USERNAME/react-book.git"
git remote add origin https://github.com/YOUR_USERNAME/react-book.git

# Create main branch (if not already on main)
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "🌿 Creating main branch..."
    git branch -M main
fi

echo ""
echo "✅ Git setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update the remote URL with your GitHub repository:"
echo "   git remote set-url origin https://github.com/YOUR_USERNAME/react-book.git"
echo ""
echo "2. Push to GitHub:"
echo "   git push -u origin main"
echo ""
echo "3. Enable GitHub Pages in your repository settings"
echo ""
echo "4. Update the README.md with your actual GitHub username and links"
echo ""
echo "🎉 Your React Book is ready for GitHub!"
