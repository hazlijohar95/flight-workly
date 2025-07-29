# Contributing to Flight Workly

Thank you for your interest in contributing to Flight Workly! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### 1. Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/flight-workly.git
   cd flight-workly
   ```

### 2. Setup Development Environment

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

### 3. Create a Branch

Create a feature branch from `main`:
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 4. Make Changes

- Write clean, readable code
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

### 5. Code Quality

Before submitting, ensure your code passes all checks:

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Build check
npm run build
```

### 6. Commit Changes

Use conventional commit messages:
```bash
git commit -m "feat: add new authentication feature"
git commit -m "fix: resolve avatar display issue"
git commit -m "docs: update README with new setup instructions"
```

### 7. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear description of changes
- Screenshots (if UI changes)
- Link to related issues

## 📋 Pull Request Guidelines

### Before Submitting

- [ ] Code follows the project's style guide
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] TypeScript types are properly defined
- [ ] No linting errors or warnings

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Cross-browser testing done

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have made corresponding changes to documentation
```

## 🎯 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful variable and function names
- Add JSDoc comments for complex functions

### Component Guidelines

- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow the existing component structure
- Use shadcn/ui components when possible

### State Management

- Use React Context for global state
- Use React Query for server state
- Keep component state local when possible
- Avoid prop drilling

### Error Handling

- Use the centralized error handler
- Implement proper error boundaries
- Provide user-friendly error messages
- Log errors appropriately

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Environment**: OS, browser, Node.js version
2. **Steps to reproduce**: Clear, step-by-step instructions
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Screenshots**: If applicable
6. **Console errors**: Any error messages

## 💡 Feature Requests

When suggesting features:

1. **Clear description**: What the feature should do
2. **Use case**: Why it's needed
3. **Implementation ideas**: How it could be implemented
4. **Mockups**: If it's a UI feature

## 📚 Documentation

Help improve documentation by:

- Updating README.md
- Adding JSDoc comments
- Creating examples
- Fixing typos or unclear sections

## 🏷️ Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested

## 📞 Getting Help

- Check existing issues and PRs
- Join our discussions
- Create an issue for questions

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Flight Workly! 🚀 