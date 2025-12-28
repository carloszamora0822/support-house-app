# Support House Patient Management System

A comprehensive patient management system for cancer support services with intake forms, visit tracking, and grant-ready analytics.

## 🎯 Project Overview

This application helps support house staff manage patient information, track physical visits, and generate reports for grant applications. Built with React, TypeScript, and Supabase.

### Key Features
- **Patient Intake**: Multi-step form with progress indicator
- **Patient Lookup**: Fast search by name, phone, DOB, email, ZIP
- **Manual Check-In**: Track physical visits with timestamps
- **Visit History**: Timeline of all patient interactions
- **Analytics Dashboard**: Grant-driven metrics and visualizations
- **Reporting**: Pre-built templates with CSV/PDF export

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete technical architecture
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Executive summary
- **[sprints/README.md](./sprints/README.md)** - Sprint planning overview
- **[coding_practices/](./coding_practices/)** - Development standards

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation
```bash
# Clone repository
git clone <repository-url>
cd XXX_Website

# Install dependencies (after Sprint 1)
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase credentials

# Run development server
npm run dev
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📦 Project Structure

```
support-house-app/
├── src/
│   ├── components/       # Reusable UI components
│   ├── features/         # Feature-based modules
│   ├── constants/        # All constants (NO hardcoding)
│   ├── lib/             # Third-party integrations
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── __mocks__/           # Mock data for testing
├── sprints/             # Sprint documentation
├── coding_practices/    # Development standards
└── supabase/           # Database migrations
```

## 🎯 Development Workflow

This project follows **Test-Driven Development (TDD)**:

1. Write tests FIRST
2. Run tests (they fail - red)
3. Implement feature (minimal code)
4. Run tests (they pass - green)
5. Refactor (keep tests green)
6. Commit (verbose message)

See [DEVELOPMENT_PRACTICES.md](./coding_practices/DEVELOPMENT_PRACTICES.md) for details.

## 📋 Sprint Progress

- [ ] Sprint 1: Foundation & Auth
- [ ] Sprint 2: Patient Search & Lookup
- [ ] Sprint 3: Manual Check-In
- [ ] Sprint 4: Patient Intake (Part 1)
- [ ] Sprint 5: Patient Intake (Part 2)
- [ ] Sprint 6: Analytics Dashboard
- [ ] Sprint 7: Reporting & Export
- [ ] Sprint 8: Polish & Production

## 🤝 Contributing

1. Read sprint documentation in `sprints/`
2. Follow TDD workflow
3. Use verbose commit messages (see `coding_practices/GIT_COMMIT_GUIDELINES.md`)
4. Ensure all tests pass
5. Check Definition of Done before PR

## 📄 License

[Add license information]

## 👥 Team

[Add team information]

## 🔗 Links

- **Production**: [Add production URL]
- **Staging**: [Add staging URL]
- **Supabase**: [Add Supabase project URL]
- **Documentation**: [Add docs URL]
