# Contributing to Sentinel Nigeria 🇳🇬

Thank you for your interest in contributing to Sentinel Nigeria! This project is part of Bloodhound's Code for Change initiative, and we're building technology that will save lives. Every contribution matters.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
- [Style Guidelines](#style-guidelines)
- [Points & Recognition](#points--recognition)
- [Community](#community)

---

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

**In short:**
- Be respectful and inclusive
- Welcome newcomers warmly
- Focus on constructive feedback
- Assume good intentions

---

## Getting Started

### Prerequisites

Before you start, make sure you have:
- **Node.js 18+** installed
- **Git** installed
- **PostgreSQL 14+** (for backend work)
- **React Native CLI** (for mobile work)
- A **GitHub account**
- Joined our **[Discord server](https://discord.gg/bloodhound-cfc)**

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Sentinel-Nigeria.git
   cd Sentinel-Nigeria
   ```

3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/CodeForChangeBH/Sentinel-Nigeria.git
   ```

4. **Install dependencies:**
   ```bash
   # Backend
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your credentials

   # Mobile
   cd ../mobile
   npm install

   # Web Dashboard
   cd ../web
   npm install
   ```

5. **Set up the database:**
   ```bash
   cd backend
   npm run migrate
   npm run seed  # Optional: Add sample data
   ```

6. **Start development servers:**
   ```bash
   # Backend (terminal 1)
   cd backend
   npm run dev

   # Mobile (terminal 2)
   cd mobile
   npm run ios  # or npm run android

   # Web (terminal 3)
   cd web
   npm run dev
   ```

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Found a bug? Help us fix it!

1. **Check if it's already reported** in [Issues](https://github.com/CodeForChangeBH/Sentinel-Nigeria/issues)
2. If not, **create a new issue** using the Bug Report template
3. Include:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, browser, app version)

### 💡 Suggesting Features

Have an idea? We'd love to hear it!

1. **Check existing feature requests** first
2. **Create a new issue** using the Feature Request template
3. Explain:
   - The problem you're solving
   - Your proposed solution
   - Why it's valuable for Nigerian communities
   - Any alternatives you've considered

### 🔧 Contributing Code

#### Finding an Issue

**For Beginners:**
- Look for issues tagged `good-first-issue`
- Start with documentation or tests
- Ask questions in Discord!

**For Experienced Developers:**
- Browse issues tagged `help-wanted`
- Look for `advanced` or `expert` tags
- Propose new features

**Before starting:**
1. Comment on the issue to claim it
2. Wait for confirmation from a maintainer
3. Ask clarifying questions if needed

#### Making Changes

1. **Create a branch** from `main`:
   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Write clean, readable code
   - Follow our style guidelines (below)
   - Add tests for new features
   - Update documentation

3. **Test your changes:**
   ```bash
   # Run tests
   npm test

   # Check linting
   npm run lint

   # Type checking
   npm run type-check
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add incident photo upload feature"
   ```

   **Commit message format:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request:**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill out the PR template completely
   - Link the related issue (e.g., "Closes #123")

#### Pull Request Guidelines

**Before submitting:**
- ✅ All tests pass
- ✅ Code is linted
- ✅ New features have tests
- ✅ Documentation is updated
- ✅ Commits are clear and atomic
- ✅ PR description is complete

**PR Title Format:**
```
feat(mobile): add incident photo upload
fix(backend): resolve authentication timeout
docs(readme): update installation instructions
```

**What happens next:**
1. A maintainer will review your PR (usually within 48 hours)
2. They may request changes
3. Address feedback and push updates
4. Once approved, your PR will be merged!
5. Points will be awarded automatically

---

## Development Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring
- `test/description` - Adding tests

### Testing

**Backend:**
```bash
cd backend
npm test                 # Run all tests
npm test -- --watch      # Watch mode
npm run test:coverage    # Coverage report
```

**Mobile:**
```bash
cd mobile
npm test                 # Unit tests
npm run test:e2e         # E2E tests (coming soon)
```

**Web:**
```bash
cd web
npm test                 # Component tests
npm run test:e2e         # E2E tests with Playwright
```

### Database Migrations

Creating a new migration:
```bash
cd backend
npm run migrate:create add_user_verification
```

Running migrations:
```bash
npm run migrate:up      # Run pending migrations
npm run migrate:down    # Rollback last migration
```

---

## Style Guidelines

### TypeScript/JavaScript

- **Use TypeScript** for all new code
- **Use functional components** (React)
- **Use hooks** instead of class components
- **Prefer `const`** over `let`, avoid `var`
- **Use async/await** over callbacks
- **Add JSDoc comments** for public APIs

**Example:**
```typescript
/**
 * Reports a new incident to the backend
 * @param incident - The incident details
 * @returns The created incident with ID
 */
async function reportIncident(incident: IncidentInput): Promise<Incident> {
  const response = await api.post('/incidents', incident)
  return response.data
}
```

### React/React Native

- **Component structure:**
  ```typescript
  // 1. Imports
  import React, { useState, useEffect } from 'react'

  // 2. Types
  interface Props {
    userId: string
  }

  // 3. Component
  export function UserProfile({ userId }: Props) {
    // 4. Hooks
    const [user, setUser] = useState<User | null>(null)

    // 5. Effects
    useEffect(() => {
      fetchUser()
    }, [userId])

    // 6. Handlers
    const handleUpdate = () => { /* ... */ }

    // 7. Render
    return (
      <View>
        {/* ... */}
      </View>
    )
  }
  ```

### CSS/Styling

- **Use Tailwind CSS** for web
- **Use StyleSheet** for React Native
- **Keep styles** near components
- **Use design tokens** from theme

### Naming Conventions

- **Files:** `camelCase.ts`, `PascalCase.tsx` (components)
- **Components:** `PascalCase`
- **Functions:** `camelCase`
- **Constants:** `SCREAMING_SNAKE_CASE`
- **Types/Interfaces:** `PascalCase`

### Comments

- **Write self-documenting code** first
- **Add comments** for complex logic
- **Use JSDoc** for public APIs
- **Explain WHY**, not WHAT

**Good:**
```typescript
// Retry 3 times because API occasionally returns 503 during high traffic
const maxRetries = 3
```

**Bad:**
```typescript
// Set max retries to 3
const maxRetries = 3
```

---

## Points & Recognition

### How Points Work

Every merged contribution earns points:

| Type | Points |
|------|--------|
| Bug fix (minor) | 50 |
| Bug fix (major) | 150 |
| Documentation | 50-100 |
| Tests | 75-150 |
| Feature (small) | 100-200 |
| Feature (medium) | 200-350 |
| Feature (large) | 350-500 |
| Architecture/Security | 500 |

### Earning Points

1. Your PR is merged
2. Points are automatically calculated
3. You appear on the [Leaderboard](https://bloodhoundsecurity.ca/code-for-change/leaderboard)
4. Earn badges for milestones:
   - 🌱 **First Timer** (1st contribution)
   - 🔥 **Contributor** (5 contributions)
   - ⭐ **Rising Star** (1,000 points)
   - 💎 **Expert** (5,000 points)
   - 👑 **Legend** (10,000 points)

### Quarterly Awards

Every quarter, we award **$2,000 in prizes**:

- 🥇 **Top Contributor:** $500 + Bloodhound Pro (1 year)
- 🥈 **Most Impactful Feature:** $400 + swag
- 🥉 **Best Newcomer:** $300 + Bloodhound Pro (6 months)
- 🎨 **Best Design/UX:** $300
- ❤️ **Community Champion:** $250 + recognition
- 🌟 **Rising Star:** $250

**Next Award Ceremony:** December 31, 2025

---

## Community

### Discord Server

Join our [Discord](https://discord.gg/bloodhound-cfc) for:
- ❓ Getting help
- 💡 Discussing ideas
- 🤝 Finding collaborators
- 📢 Announcements
- 🎉 Celebrating wins

**Channels:**
- `#introductions` - Say hello!
- `#general` - General discussion
- `#help` - Get unstuck
- `#sentinel-nigeria` - Project-specific
- `#code-review` - Request reviews
- `#showcase` - Show your work

### Getting Help

**Stuck? Here's how to get help:**

1. **Check documentation** first
2. **Search existing issues** and discussions
3. **Ask in Discord** `#help` channel
4. **Create a discussion** on GitHub
5. **Tag maintainers** if urgent

**When asking for help:**
- Describe what you're trying to do
- Share error messages (full text)
- Show your code (use code blocks)
- Explain what you've tried

### Code Review

All PRs require review from at least one maintainer.

**As a contributor:**
- Be patient - reviews take time
- Address feedback constructively
- Ask questions if unclear
- Thank reviewers!

**As a reviewer:**
- Be kind and constructive
- Explain your suggestions
- Approve when ready
- Celebrate good work!

---

## Recognition

### Hall of Fame

Top contributors will be featured:
- On our website
- In quarterly newsletters
- On social media
- In annual reports

### Testimonials

We'll help you showcase your work:
- LinkedIn recommendations
- Reference letters
- Portfolio pieces
- Conference talks

---

## Questions?

- 💬 **Discord:** [Join here](https://discord.gg/bloodhound-cfc)
- 📧 **Email:** codeforchange@bloodhoundsecurity.ca
- 🌐 **Website:** [bloodhoundsecurity.ca/code-for-change](https://bloodhoundsecurity.ca/code-for-change)

---

## Thank You!

Your contribution is protecting Nigerian communities and saving lives. We're grateful to have you here.

**Let's build it together.** 🇳🇬

---

**[Back to README](README.md)** • **[View Issues](https://github.com/CodeForChangeBH/Sentinel-Nigeria/issues)** • **[Join Discord](https://discord.gg/bloodhound-cfc)**
