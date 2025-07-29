# Flight Workly 🚀

A modern freelancing platform built with React, TypeScript, and Supabase. Connect skilled freelancers with businesses through an intuitive, secure, and feature-rich platform.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)

## 🌟 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Authentication**: Supabase Auth with email verification and password reset
- **Real-time**: Live updates and notifications
- **Responsive Design**: Mobile-first approach with modern UI
- **Type Safety**: Full TypeScript coverage with strict typing
- **Form Validation**: Zod schema validation with React Hook Form
- **Error Handling**: Centralized error management and monitoring
- **3D Graphics**: React Three.js integration for immersive UI
- **Payment Processing**: CHIP integration with escrow system
- **Job Management**: Complete job posting, bidding, and milestone tracking



## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: React Query, Context API
- **Forms**: React Hook Form, Zod
- **Routing**: React Router DOM
- **3D Graphics**: React Three.js, Three.js
- **UI Components**: Radix UI, Lucide Icons

## 📋 Prerequisites

- Node.js 18+ 
- npm or bun
- Git
- Supabase account (for backend services)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/hazlijohar95/flight-workly.git
cd flight-workly
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Application Configuration
VITE_APP_NAME=Flight Workly
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
```

### 4. Start Development Server

```bash
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:8080`

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting issues
npm run type-check      # TypeScript type checking
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting

# Utilities
npm run clean           # Clean build artifacts
npm test                # Run tests (placeholder)
```

### Code Quality Standards

- **TypeScript**: Strict typing throughout the codebase
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Conventional Commits**: Standardized commit messages
- **Error Handling**: Centralized error management
- **Logging**: Structured logging system



## 📁 Project Structure

```
flight-workly/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── three/          # 3D graphics components
│   │   └── jobs/           # Job-related components
│   ├── pages/              # Page components
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard pages
│   │   └── jobs/           # Job-related pages
│   ├── hooks/              # Custom React hooks
│   ├── context/            # React Context providers
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── constants/          # Application constants
│   ├── integrations/       # Third-party integrations
│   ├── data/               # Static data and mock data
│   └── theme/              # Theme configuration
├── supabase/               # Supabase Edge Functions
│   └── functions/          # Backend functions
├── public/                 # Static assets
├── docs/                   # Documentation
└── config files            # Configuration files
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all linting checks pass
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check our [docs](docs/) folder
- **Issues**: [GitHub Issues](https://github.com/hazlijohar95/flight-workly/issues)
- **Discussions**: [GitHub Discussions](https://github.com/hazlijohar95/flight-workly/discussions)
- **Email**: [coding@hazlijohar.com](mailto:coding@hazlijohar.com)

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React Three.js](https://github.com/pmndrs/react-three-fiber) for 3D graphics
- [Vite](https://vitejs.dev/) for the build tool
- [TypeScript](https://www.typescriptlang.org/) for type safety

## 📊 Project Status

- **Version**: 1.0.0
- **Status**: Production Ready
- **Last Updated**: January 2025
- **Maintainer**: [Hazli Johar](https://github.com/hazlijohar95)

---

**Made with ❤️ by the Flight Workly Team**

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🏗️ Architecture

### Type Safety
- Full TypeScript coverage with strict mode enabled
- Comprehensive type definitions in `/src/types`
- Zod schema validation for forms and API responses

### Error Handling
- Centralized error handling with `ErrorHandler` utility
- Custom error classes for different error types
- Consistent error display with toast notifications

### State Management
- React Query for server state management
- Context API for global application state
- Local state with React hooks

### Code Quality
- ESLint with strict TypeScript rules
- Prettier for code formatting
- Husky for pre-commit hooks (recommended)

## 🎨 Styling

The project uses Tailwind CSS with shadcn/ui components:

- **Design System**: Consistent spacing, colors, and typography
- **Responsive**: Mobile-first responsive design
- **Dark Mode**: Built-in dark mode support
- **Custom Components**: Reusable UI components

## 🔐 Authentication

Authentication is handled by Supabase Auth:

- Email/password authentication
- Social login (configurable)
- Password reset functionality
- Protected routes
- User profile management

## 📱 Responsive Design

The application is fully responsive with:

- Mobile-first approach
- Custom responsive hooks
- Breakpoint utilities
- Touch-friendly interfaces

## 🧪 Testing

To run tests (when implemented):

```bash
npm run test
npm run test:watch
npm run test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Use functional components with hooks
- Implement proper error handling
- Write meaningful commit messages

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `VITE_APP_NAME` | Application name | No |
| `VITE_APP_VERSION` | Application version | No |
| `VITE_APP_ENV` | Environment (development/production) | No |

## 🐛 Troubleshooting

### Common Issues

1. **TypeScript Errors**: Ensure all dependencies are installed and TypeScript is properly configured
2. **Environment Variables**: Check that all required environment variables are set
3. **Build Errors**: Clear node_modules and reinstall dependencies
4. **Supabase Connection**: Verify Supabase URL and keys are correct

### Getting Help

- Check the [Issues](https://github.com/hazlijohar95/flight-workly/issues) page
- Create a new issue with detailed information
- Include error messages and steps to reproduce

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [shadcn/ui](https://ui.shadcn.com) for the component library
- [Vite](https://vitejs.dev) for the build tool
- [Tailwind CSS](https://tailwindcss.com) for styling
