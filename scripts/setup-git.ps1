# React Book - Git Setup Script (PowerShell)
# This script helps set up the Git repository for GitHub publication

Write-Host "🚀 Setting up Git repository for React Book..." -ForegroundColor Green

# Check if Git is installed
try {
    git --version | Out-Null
    Write-Host "✅ Git is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed. Please install Git first." -ForegroundColor Red
    exit 1
}

# Initialize Git repository (if not already initialized)
if (-not (Test-Path ".git")) {
    Write-Host "📁 Initializing Git repository..." -ForegroundColor Yellow
    git init
} else {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
}

# Add all files to staging
Write-Host "📝 Adding files to staging..." -ForegroundColor Yellow
git add .

# Create initial commit
Write-Host "💾 Creating initial commit..." -ForegroundColor Yellow
git commit -m "feat: initial commit - React Book with interactive projects

- Complete React learning guide with 10+ chapters
- Interactive projects: Todo, Dashboard, E-commerce, Portfolio
- Modern tech stack: Vite, Tailwind CSS, Framer Motion
- Comprehensive testing setup with Jest and Cypress
- CI/CD pipeline with GitHub Actions
- Professional documentation and contribution guidelines"

# Add remote origin (user will need to update this)
Write-Host "🔗 Adding remote origin..." -ForegroundColor Yellow
Write-Host "Please update the remote URL with your GitHub repository:" -ForegroundColor Cyan
Write-Host "git remote set-url origin https://github.com/YOUR_USERNAME/react-book.git" -ForegroundColor White
git remote add origin https://github.com/YOUR_USERNAME/react-book.git

# Create main branch (if not already on main)
$current_branch = git branch --show-current
if ($current_branch -ne "main") {
    Write-Host "🌿 Creating main branch..." -ForegroundColor Yellow
    git branch -M main
}

Write-Host ""
Write-Host "✅ Git setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Update the remote URL with your GitHub repository:" -ForegroundColor White
Write-Host "   git remote set-url origin https://github.com/YOUR_USERNAME/react-book.git" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Push to GitHub:" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Enable GitHub Pages in your repository settings" -ForegroundColor White
Write-Host ""
Write-Host "4. Update the README.md with your actual GitHub username and links" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Your React Book is ready for GitHub!" -ForegroundColor Green
