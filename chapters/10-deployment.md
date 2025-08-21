# Chapter 10: Deployment and CI/CD

## 🎯 Learning Objectives

By the end of this chapter, you will be able to:
- Deploy React applications to various hosting platforms
- Set up environment variables and configuration management
- Implement CI/CD pipelines with GitHub Actions and GitLab CI
- Configure monitoring and logging for production applications
- Optimize builds for production deployment
- Handle different deployment strategies and rollbacks

---

## 🚀 Deployment Platforms

### Vercel (Recommended for React)

Vercel is the platform created by the Next.js team and offers the best experience for React applications.

#### Setup and Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from your project directory
vercel

# Or deploy with specific settings
vercel --prod
```

#### Configuration File

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/favicon.ico",
      "dest": "/favicon.ico"
    },
    {
      "src": "/manifest.json",
      "dest": "/manifest.json"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "@api-url",
    "REACT_APP_ENVIRONMENT": "production"
  }
}
```

#### Environment Variables

```bash
# Set environment variables
vercel env add REACT_APP_API_URL
vercel env add REACT_APP_STRIPE_PUBLIC_KEY

# View environment variables
vercel env ls

# Remove environment variables
vercel env rm REACT_APP_API_URL
```

### Netlify

Netlify is another excellent platform for React applications with great features like form handling and serverless functions.

#### Setup and Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

#### Configuration File

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "build"
  functions = "functions"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### GitHub Pages

GitHub Pages is free and integrates well with GitHub repositories.

#### Setup

```bash
# Install gh-pages package
npm install --save-dev gh-pages

# Add scripts to package.json
```

```json
// package.json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  },
  "homepage": "https://yourusername.github.io/your-repo-name"
}
```

#### Deployment

```bash
# Deploy to GitHub Pages
npm run deploy
```

### AWS S3 + CloudFront

For enterprise applications, AWS S3 with CloudFront provides excellent performance and scalability.

#### Setup Script

```bash
#!/bin/bash
# deploy.sh

# Build the application
npm run build

# Sync with S3 bucket
aws s3 sync build/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment completed!"
```

#### CloudFormation Template

```yaml
# cloudformation.yml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'React App Deployment Infrastructure'

Parameters:
  DomainName:
    Type: String
    Description: Domain name for the application

Resources:
  S3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Ref DomainName
      WebsiteConfiguration:
        IndexDocument: index.html
        ErrorDocument: index.html
      PublicAccessBlockConfiguration:
        BlockPublicAcls: false
        BlockPublicPolicy: false
        IgnorePublicAcls: false
        RestrictPublicBuckets: false

  S3BucketPolicy:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket: !Ref S3Bucket
      PolicyDocument:
        Statement:
          - Effect: Allow
            Principal: '*'
            Action: s3:GetObject
            Resource: !Sub '${S3Bucket}/*'

  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - DomainName: !GetAtt S3Bucket.RegionalDomainName
            Id: S3Origin
            S3OriginConfig:
              OriginAccessIdentity: ''
        Enabled: true
        DefaultRootObject: index.html
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad
        CustomErrorResponses:
          - ErrorCode: 404
            ResponseCode: 200
            ResponsePagePath: /index.html
```

---

## 🔧 Environment Configuration

### Environment Variables Setup

```bash
# .env.development
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG=true
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
REACT_APP_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID

# .env.production
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENVIRONMENT=production
REACT_APP_DEBUG=false
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_...
REACT_APP_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID

# .env.staging
REACT_APP_API_URL=https://staging-api.yourdomain.com
REACT_APP_ENVIRONMENT=staging
REACT_APP_DEBUG=true
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
REACT_APP_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

### Environment Configuration Utility

```js
// config/environment.js
const environment = {
  development: {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    environment: 'development',
    debug: process.env.REACT_APP_DEBUG === 'true',
    stripePublicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
    googleAnalyticsId: process.env.REACT_APP_GOOGLE_ANALYTICS_ID,
    sentryDsn: process.env.REACT_APP_SENTRY_DSN,
    features: {
      analytics: true,
      errorReporting: true,
      featureFlags: true
    }
  },
  staging: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://staging-api.yourdomain.com',
    environment: 'staging',
    debug: process.env.REACT_APP_DEBUG === 'true',
    stripePublicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
    googleAnalyticsId: process.env.REACT_APP_GOOGLE_ANALYTICS_ID,
    sentryDsn: process.env.REACT_APP_SENTRY_DSN,
    features: {
      analytics: true,
      errorReporting: true,
      featureFlags: true
    }
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://api.yourdomain.com',
    environment: 'production',
    debug: false,
    stripePublicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
    googleAnalyticsId: process.env.REACT_APP_GOOGLE_ANALYTICS_ID,
    sentryDsn: process.env.REACT_APP_SENTRY_DSN,
    features: {
      analytics: true,
      errorReporting: true,
      featureFlags: false
    }
  }
};

const currentEnv = process.env.REACT_APP_ENVIRONMENT || 'development';
export const config = environment[currentEnv];

export default config;
```

### Feature Flags Implementation

```js
// hooks/useFeatureFlag.js
import { useContext, createContext } from 'react';
import config from '../config/environment';

const FeatureFlagContext = createContext();

export function FeatureFlagProvider({ children }) {
  const features = config.features;

  return (
    <FeatureFlagContext.Provider value={features}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlag(flagName) {
  const features = useContext(FeatureFlagContext);
  return features[flagName] || false;
}

// Usage in components
function AnalyticsComponent() {
  const analyticsEnabled = useFeatureFlag('analytics');
  
  if (!analyticsEnabled) {
    return null;
  }
  
  return <GoogleAnalytics />;
}
```

---

## 🔄 CI/CD Pipelines

### GitHub Actions

#### Basic React CI/CD Pipeline

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run tests
      run: npm test -- --coverage --watchAll=false
    
    - name: Build application
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: build/

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-files
        path: build/
    
    - name: Deploy to Vercel (Staging)
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-files
        path: build/
    
    - name: Deploy to Vercel (Production)
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

#### Advanced Pipeline with Security Scanning

```yaml
# .github/workflows/advanced-ci-cd.yml
name: Advanced CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Run security audit
      run: npm audit --audit-level moderate
    
    - name: Run Snyk security scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=high

  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Run tests
      run: npm test -- --coverage --watchAll=false
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella

  build:
    needs: [security-scan, test]
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Analyze bundle size
      run: npm run analyze
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: build/

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-files
        path: build/
    
    - name: Deploy to Vercel (Staging)
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-files
        path: build/
    
    - name: Deploy to Vercel (Production)
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
    
    - name: Run smoke tests
      run: |
        npm install -g wait-on
        wait-on https://your-app.vercel.app
        npm run test:e2e:prod
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - security
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

security_scan:
  stage: security
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm audit --audit-level moderate
  allow_failure: true

test:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run lint
    - npm run type-check
    - npm test -- --coverage --watchAll=false
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
    paths:
      - coverage/

build:
  stage: build
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run build
    - npm run analyze
  artifacts:
    paths:
      - build/
    expire_in: 1 week

deploy_staging:
  stage: deploy
  image: node:${NODE_VERSION}
  script:
    - npm install -g vercel
    - vercel --token $VERCEL_TOKEN --prod
  environment:
    name: staging
    url: https://staging.your-app.vercel.app
  only:
    - develop

deploy_production:
  stage: deploy
  image: node:${NODE_VERSION}
  script:
    - npm install -g vercel
    - vercel --token $VERCEL_TOKEN --prod
  environment:
    name: production
    url: https://your-app.vercel.app
  only:
    - main
  when: manual
```

---

## 📊 Monitoring and Logging

### Error Tracking with Sentry

```js
// utils/sentry.js
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import config from '../config/environment';

if (config.sentryDsn) {
  Sentry.init({
    dsn: config.sentryDsn,
    integrations: [new BrowserTracing()],
    tracesSampleRate: config.environment === 'production' ? 0.1 : 1.0,
    environment: config.environment,
    beforeSend(event) {
      // Filter out certain errors
      if (event.exception) {
        const exception = event.exception.values[0];
        if (exception.type === 'ChunkLoadError') {
          return null; // Don't send chunk load errors
        }
      }
      return event;
    }
  });
}

export default Sentry;
```

### Performance Monitoring

```js
// utils/performance.js
import config from '../config/environment';

export function trackPageView(pageName) {
  if (config.features.analytics && window.gtag) {
    window.gtag('config', config.googleAnalyticsId, {
      page_title: pageName,
      page_location: window.location.href
    });
  }
}

export function trackEvent(eventName, parameters = {}) {
  if (config.features.analytics && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
}

export function trackError(error, errorInfo = {}) {
  if (config.features.errorReporting && window.Sentry) {
    window.Sentry.captureException(error, {
      extra: errorInfo
    });
  }
}

// Performance monitoring hook
export function usePerformanceTracking(componentName) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (duration > 100) { // Log slow renders
        console.warn(`${componentName} took ${duration.toFixed(2)}ms to render`);
      }
    };
  });
}
```

### Health Checks and Monitoring

```js
// components/HealthCheck.jsx
import React, { useEffect, useState } from 'react';

function HealthCheck() {
  const [health, setHealth] = useState({ status: 'checking', timestamp: null });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        
        setHealth({
          status: data.status,
          timestamp: new Date().toISOString(),
          version: data.version,
          uptime: data.uptime
        });
      } catch (error) {
        setHealth({
          status: 'error',
          timestamp: new Date().toISOString(),
          error: error.message
        });
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (health.status === 'checking') {
    return <div>Checking system health...</div>;
  }

  return (
    <div className="health-check">
      <h3>System Health</h3>
      <p>Status: {health.status}</p>
      <p>Last Check: {health.timestamp}</p>
      {health.version && <p>Version: {health.version}</p>}
      {health.uptime && <p>Uptime: {health.uptime}</p>}
      {health.error && <p>Error: {health.error}</p>}
    </div>
  );
}

export default HealthCheck;
```

---

## 🔄 Deployment Strategies

### Blue-Green Deployment

```yaml
# .github/workflows/blue-green-deployment.yml
name: Blue-Green Deployment

on:
  push:
    branches: [ main ]

jobs:
  deploy-blue:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Blue Environment
      run: |
        # Deploy to blue environment
        vercel --token ${{ secrets.VERCEL_TOKEN }} --prod --name blue
        
    - name: Run Smoke Tests on Blue
      run: |
        npm run test:e2e:blue
        
    - name: Switch Traffic to Blue
      run: |
        # Update DNS/load balancer to point to blue
        # This would be your actual traffic switching logic

  rollback:
    runs-on: ubuntu-latest
    if: failure()
    steps:
    - name: Rollback to Green
      run: |
        # Switch traffic back to green environment
        echo "Rolling back to green environment"
```

### Canary Deployment

```js
// utils/canary.js
export function isCanaryUser(userId) {
  // Simple canary logic - 10% of users
  const hash = simpleHash(userId);
  return hash % 100 < 10;
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Usage in components
function App() {
  const userId = useUserId();
  const isCanary = isCanaryUser(userId);
  
  return (
    <div>
      {isCanary && <CanaryBanner />}
      <MainApp />
    </div>
  );
}
```

---

## 📝 Chapter Summary

**Key Concepts Covered:**
1. **Deployment Platforms**: Vercel, Netlify, GitHub Pages, AWS S3/CloudFront
2. **Environment Configuration**: Environment variables, feature flags, configuration management
3. **CI/CD Pipelines**: GitHub Actions, GitLab CI, automated testing and deployment
4. **Monitoring and Logging**: Error tracking, performance monitoring, health checks
5. **Deployment Strategies**: Blue-green deployment, canary releases, rollback procedures

**What's Next:**
In the next chapter, we'll build practical projects to apply all the concepts we've learned throughout the book.

---

## 🎯 Practice Exercises

### Exercise 1: Multi-Environment Setup
Set up a complete multi-environment deployment:
- Configure development, staging, and production environments
- Set up environment-specific variables and features
- Implement automated deployment pipelines
- Add monitoring and alerting

### Exercise 2: CI/CD Pipeline
Build a comprehensive CI/CD pipeline:
- Security scanning and vulnerability checks
- Automated testing and code quality checks
- Build optimization and artifact management
- Deployment with rollback capabilities

### Exercise 3: Monitoring Dashboard
Create a monitoring dashboard:
- Real-time health checks
- Performance metrics tracking
- Error reporting and alerting
- User analytics and insights

### Exercise 4: Deployment Automation
Implement advanced deployment strategies:
- Blue-green deployment setup
- Canary release implementation
- Automated rollback procedures
- A/B testing infrastructure

---

*Ready to build practical projects? Let's move to Chapter 11! 🚀*
