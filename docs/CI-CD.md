# CI/CD Pipeline Documentation

## Overview

Flight Workly uses GitHub Actions for continuous integration and deployment. The pipeline ensures code quality, security, and automated deployments.

## Workflows

### 1. CI Pipeline (`ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**

#### Test & Lint
- Runs on Node.js 18 and 20
- Type checking with TypeScript
- Linting with ESLint
- Unit tests with Vitest
- Coverage reporting with Codecov

#### Build
- Builds the application for production
- Uploads build artifacts
- Runs after successful tests

#### Security Scan
- npm audit for dependency vulnerabilities
- Snyk security scanning (optional)
- Runs independently

### 2. E2E Testing (`e2e.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual trigger

**Features:**
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile testing (Pixel 5, iPhone 12)
- Screenshot and video capture on failure
- Test result artifacts

### 3. Deployment (`deploy.yml`)

**Triggers:**
- Push to `main` branch
- Manual trigger

**Process:**
- Runs tests
- Builds application
- Deploys to Netlify
- Comments on PRs with preview URLs

### 4. Dependency Updates (`dependencies.yml`)

**Triggers:**
- Weekly schedule (Monday 9 AM UTC)
- Manual trigger

**Features:**
- Updates npm dependencies
- Runs tests to ensure compatibility
- Creates PR with updates
- Fixes security vulnerabilities

## Environment Variables

### Required Secrets

```bash
# Netlify Deployment
NETLIFY_AUTH_TOKEN=your_netlify_auth_token
NETLIFY_SITE_ID=your_netlify_site_id

# Security Scanning (Optional)
SNYK_TOKEN=your_snyk_token

# Code Coverage (Optional)
CODECOV_TOKEN=your_codecov_token
```

### Setting Up Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add the required secrets

## Local Development

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check

# Format code
npm run format

# Check formatting
npm run format:check
```

## Testing Strategy

### Unit Tests
- **Framework:** Vitest
- **Coverage:** Target 80%+
- **Location:** `src/**/*.test.ts` or `src/**/*.test.tsx`
- **Focus:** Component logic, utilities, hooks

### Integration Tests
- **Framework:** Vitest + React Testing Library
- **Location:** `src/**/*.test.tsx`
- **Focus:** Component interactions, API calls

### E2E Tests
- **Framework:** Playwright
- **Location:** `src/test/e2e/`
- **Focus:** User workflows, critical paths

### Test Data
- **Mock Data:** `src/test/utils/test-utils.tsx`
- **MSW Handlers:** For API mocking
- **Test Factories:** For creating test data

## Deployment Strategy

### Environments

1. **Development**
   - Branch: `develop`
   - URL: `https://dev-flight-workly.netlify.app`
   - Auto-deploy on push

2. **Staging**
   - Branch: `staging`
   - URL: `https://staging-flight-workly.netlify.app`
   - Manual deployment

3. **Production**
   - Branch: `main`
   - URL: `https://flight-workly.netlify.app`
   - Auto-deploy on merge

### Deployment Process

1. **Pre-deployment Checks**
   - All tests pass
   - Code coverage meets threshold
   - Security scan passes
   - Build succeeds

2. **Deployment Steps**
   - Build application
   - Upload to Netlify
   - Run post-deployment tests
   - Notify stakeholders

3. **Rollback Strategy**
   - Keep previous deployment
   - Quick rollback via Netlify dashboard
   - Automated rollback on critical failures

## Monitoring and Alerts

### Success Metrics
- Build success rate > 95%
- Test pass rate > 98%
- Deployment time < 5 minutes
- Zero security vulnerabilities

### Alerts
- Failed builds
- Failed deployments
- Security vulnerabilities
- Performance regressions

## Best Practices

### Code Quality
- Write tests for new features
- Maintain test coverage
- Use conventional commits
- Review PRs thoroughly

### Security
- Regular dependency updates
- Security scanning in CI
- Environment variable management
- Access control

### Performance
- Monitor bundle size
- Optimize build times
- Cache dependencies
- Parallel job execution

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check dependency conflicts
   - Verify environment variables
   - Review build logs

2. **Test Failures**
   - Update test data
   - Check component changes
   - Verify mock implementations

3. **Deployment Issues**
   - Check Netlify configuration
   - Verify build artifacts
   - Review deployment logs

### Getting Help
- Check GitHub Actions logs
- Review documentation
- Create issue with details
- Contact maintainers

## Future Improvements

- [ ] Add performance testing
- [ ] Implement canary deployments
- [ ] Add automated accessibility testing
- [ ] Set up monitoring and alerting
- [ ] Implement feature flags
- [ ] Add load testing 