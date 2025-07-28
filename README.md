# Flight Workly

A modern freelancing platform built with React, TypeScript, and Supabase.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **Authentication**: Supabase Auth with Clerk integration
- **Real-time**: Live updates and notifications
- **Responsive Design**: Mobile-first approach
- **Type Safety**: Full TypeScript coverage
- **Form Validation**: Zod schema validation
- **Error Handling**: Centralized error management
- **3D Graphics**: React Three.js integration

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

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Application Configuration
VITE_APP_NAME=Flight Workly
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=false
```

### 4. Start Development Server

```bash
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:8080`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── three/          # 3D components
│   └── jobs/           # Job-related components
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   └── jobs/           # Job-related pages
├── hooks/              # Custom React hooks
├── context/            # React Context providers
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── constants/          # Application constants
├── integrations/       # Third-party integrations
├── data/               # Static data and mock data
└── theme/              # Theme configuration
```

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
