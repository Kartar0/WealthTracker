# NetWorth Pro - Personal Finance Calculator

## Overview

NetWorth Pro is a comprehensive web application designed to help users calculate and track their personal net worth. The application provides an intuitive multi-step interface for inputting assets and liabilities, automatically calculating net worth, and presenting detailed financial insights through interactive dashboards and charts. Built with a modern full-stack architecture, it offers both in-memory storage for development and PostgreSQL support for production environments.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using **React 18** with **TypeScript** and follows a component-based architecture. Key architectural decisions include:

- **Routing**: Uses Wouter for lightweight client-side routing
- **State Management**: Combines React hooks with TanStack Query for server state management
- **UI Framework**: Implements Shadcn/ui components built on Radix UI primitives for consistent, accessible design
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Charts**: Chart.js integration for financial data visualization

The application follows a multi-step wizard pattern for data collection:
1. Assets input form with categorized fields
2. Liabilities input form with debt categories  
3. Results dashboard with calculations and visualizations

### Backend Architecture
The backend uses **Express.js** with TypeScript in an ESM configuration. Core architectural patterns include:

- **Storage Abstraction**: Interface-based storage layer supporting both in-memory (development) and database (production) implementations
- **API Design**: RESTful endpoints for net worth calculations with proper validation
- **Request Handling**: Centralized error handling and logging middleware
- **Development Integration**: Vite middleware integration for seamless development experience

### Data Storage Solutions
The application supports dual storage strategies:

- **Development**: In-memory storage using Map-based implementations for rapid development
- **Production**: PostgreSQL database with Drizzle ORM for type-safe database operations
- **Schema Management**: Centralized schema definitions using Drizzle with Zod validation

Database schema includes:
- Users table for authentication (prepared for future use)
- Net worth calculations table with JSON fields for flexible asset/liability storage
- Automatic UUID generation and timestamp tracking

### Authentication and Authorization
The codebase includes authentication infrastructure:
- User schema with username/password fields
- Session management preparation with connect-pg-simple
- Currently uses in-memory user storage with plans for database integration

### Build and Development Architecture
- **Bundling**: Vite for frontend bundling with hot module replacement
- **Server Building**: esbuild for backend compilation to ESM format
- **Development Server**: Express server with Vite middleware integration
- **TypeScript**: Strict configuration with path mapping for clean imports

### Data Models and Validation
The application uses a sophisticated validation system:
- **Asset Categories**: Cash & banking, real estate, investments, personal property
- **Liability Categories**: Mortgages, credit cards, loans, vehicle financing
- **Currency Support**: Multi-currency support with proper formatting
- **Type Safety**: Zod schemas ensure runtime type validation matching TypeScript types

## External Dependencies

### Database and ORM
- **@neondatabase/serverless**: Serverless PostgreSQL driver optimized for edge environments
- **drizzle-orm**: Type-safe SQL query builder and ORM
- **drizzle-kit**: Database migration and schema management tools
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### UI and Styling
- **@radix-ui/***: Comprehensive collection of accessible, unstyled UI primitives
- **tailwindcss**: Utility-first CSS framework for rapid styling
- **class-variance-authority**: Type-safe CSS class variance management
- **lucide-react**: Consistent icon library for user interface elements

### Data Management
- **@tanstack/react-query**: Server state management with caching and synchronization
- **react-hook-form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Validation resolver integration for form validation
- **zod**: Schema validation library for runtime type checking

### Charts and Visualization
- **chart.js**: Flexible charting library for financial data visualization
- **date-fns**: Modern date utility library for timestamp formatting

### Development Tools
- **vite**: Fast build tool and development server
- **@replit/vite-plugin-***: Replit-specific development enhancements
- **esbuild**: Fast JavaScript bundler for production builds
- **tsx**: TypeScript execution engine for development

### Routing and Navigation
- **wouter**: Minimalist routing library for React applications

The application is designed to be deployment-ready for Replit environments while maintaining compatibility with standard Node.js hosting platforms.