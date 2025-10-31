# ExpenseTracker

## Overview

ExpenseTracker is a full-stack web application for personal finance management. Users can track expenses, set monthly budgets by category, and visualize spending patterns through interactive charts and analytics. The application provides a clean, modern interface inspired by fintech leaders like Mint and YNAB, emphasizing data clarity and efficient workflows.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Routing**
- React 18 with TypeScript using Vite as the build tool
- Client-side routing via Wouter (lightweight alternative to React Router)
- Single Page Application (SPA) architecture with authenticated and public routes

**UI Component System**
- Shadcn/ui component library (Radix UI primitives with Tailwind CSS)
- Custom design system following "New York" style variant
- Tailwind CSS for styling with custom color variables for light/dark mode support
- Responsive design with mobile-first approach

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management and caching
- Form state managed by React Hook Form with Zod schema validation
- Authentication state handled through React Query with cookie-based sessions

**Data Visualization**
- Recharts library for analytics dashboards
- Three main chart types: monthly trends (bar), category breakdown (pie), and budget comparison (bar)

### Backend Architecture

**Server Framework**
- Express.js on Node.js with TypeScript
- Custom Vite integration for development with HMR (Hot Module Replacement)
- Production build uses esbuild for server bundling

**API Design**
- RESTful API structure with resource-based endpoints
- Authentication via JWT tokens stored in HTTP-only cookies
- Endpoints organized by domain: `/api/auth/*`, `/api/expenses/*`, `/api/budgets/*`, `/api/analytics/*`

**Authentication & Security**
- JWT-based authentication with 7-day token expiration
- Bcrypt for password hashing (10 rounds)
- HTTP-only cookies for token storage (CSRF protection)
- Middleware-based route protection using `authenticateToken`

**Data Storage Strategy**
- In-memory storage implementation (`MemStorage`) for development/testing
- Schema-first approach using Drizzle ORM with PostgreSQL support configured
- Three main entities: Users, Expenses, and Budgets with UUID primary keys
- Database migrations managed through Drizzle Kit

**Validation Layer**
- Zod schemas shared between client and server (located in `shared/schema.ts`)
- Request validation happens at API route level before database operations
- Type-safe data contracts enforced across the full stack

### Database Schema

**Users Table**
- Fields: id (UUID), email (unique), password (hashed), name, timestamps
- Email serves as unique identifier for authentication

**Expenses Table**
- Fields: id (UUID), userId (foreign key), title, amount (real/float), category, description, date, tags (array), timestamps
- Categories: Food, Transport, Entertainment, Utilities, Healthcare, Other
- Supports tagging for flexible categorization

**Budgets Table**
- Fields: id (UUID), userId (foreign key), category, amount (real/float), month (timestamp), timestamps
- One budget per category per month pattern
- Used for spending alerts and comparison analytics

### Design System

**Typography**
- Primary: Inter font family for UI and headings
- Monospace: JetBrains Mono for currency values and statistics
- Hierarchical sizing from text-xs to text-5xl with semantic font weights

**Layout & Spacing**
- Consistent spacing primitives: 2, 4, 6, 8 (Tailwind units)
- Responsive grid systems for dashboard stats and content cards
- Max-width containers (7xl for content, 2xl for forms)

**Color System**
- CSS custom properties for theme flexibility
- Automatic border computation for primary/destructive buttons
- Elevation layers using semi-transparent overlays for hover/active states

## External Dependencies

**Core Framework Dependencies**
- `express` - Backend HTTP server
- `react` & `react-dom` - Frontend UI framework
- `vite` - Frontend build tool and dev server
- `typescript` - Type safety across the stack

**Database & ORM**
- `drizzle-orm` - Type-safe SQL query builder
- `drizzle-kit` - Database migration toolkit
- `@neondatabase/serverless` - PostgreSQL driver (configured for Neon)

**Authentication & Security**
- `jsonwebtoken` - JWT token generation and verification
- `bcryptjs` - Password hashing
- `cookie-parser` - Cookie parsing middleware

**UI Component Libraries**
- `@radix-ui/*` - Unstyled accessible UI primitives (20+ components)
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` & `clsx` - Dynamic className management

**Form Management**
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Validation resolver integration
- `zod` - Schema validation library

**Data Visualization**
- `recharts` - Composable charting library

**Data Fetching**
- `@tanstack/react-query` - Server state management
- `@tanstack/react-table` - Headless table utilities

**Development Tools**
- `@replit/vite-plugin-*` - Replit-specific dev enhancements
- `tsx` - TypeScript execution for development
- `esbuild` - Production server bundling

**Routing**
- `wouter` - Minimalist client-side router

**Date Utilities**
- `date-fns` - Date formatting and manipulation

**Icons**
- `lucide-react` - Icon component library