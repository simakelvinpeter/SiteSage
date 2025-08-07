# WebGenius AI - AI-Powered Website Generator

## Overview

WebGenius AI is a full-stack web application that uses artificial intelligence to generate complete, professional websites based on user descriptions. The application features a React frontend with shadcn/ui components and an Express.js backend that integrates with OpenAI's GPT models to create custom HTML/CSS websites.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom configuration

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Style**: RESTful API endpoints
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI GPT-4o for website content generation
- **Session Storage**: PostgreSQL-based session store
- **Development**: Hot Module Replacement (HMR) with Vite integration

### Database Schema
- **Users Table**: Basic user authentication (id, username, password)
- **Websites Table**: Generated website storage including HTML, CSS, navigation items, and configuration options
- **Database Provider**: Neon Database (serverless PostgreSQL)

## Key Components

### Frontend Components
1. **WebsiteGenerator**: Form component for capturing user requirements with color picker and image URL inputs
2. **WebsitePreview**: Preview component with responsive design testing
3. **UI Components**: Complete shadcn/ui component library for consistent design
4. **Toast System**: User feedback and notifications
5. **Color Customization**: Visual color pickers for primary and secondary colors
6. **Image Management**: Dynamic image URL input system with add/remove functionality

### Backend Services
1. **Website Generation API**: `/api/websites/generate` endpoint
2. **Website Retrieval API**: `/api/websites/:id` endpoint
3. **OpenAI Service**: Handles AI-powered website generation
4. **Storage Layer**: Abstract storage interface with memory-based implementation

### Shared Schema
- Zod validation schemas for type-safe data handling
- Database table definitions using Drizzle ORM
- TypeScript types exported for frontend consumption

## Data Flow

1. **User Input**: User fills out website generation form with name, description, color scheme, image URLs, and options
2. **Validation**: Form data validated using Zod schemas on both client and server
3. **AI Generation**: Backend sends structured prompt to OpenAI GPT-4o including color and image preferences
4. **Content Processing**: AI returns HTML, CSS with custom colors, navigation items, and footer content
5. **Storage**: Generated website saved to PostgreSQL database with color and image metadata
6. **Response**: Website data returned to frontend for preview
7. **Download**: Users can download complete HTML files with custom styling locally

## External Dependencies

### Core Dependencies
- **OpenAI API**: For AI-powered website generation
- **Neon Database**: Serverless PostgreSQL hosting
- **Radix UI**: Accessible component primitives
- **TanStack Query**: Server state management
- **Drizzle ORM**: Type-safe database operations

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **ESBuild**: Production bundling for backend
- **Tailwind CSS**: Utility-first styling

## Deployment Strategy

### Production Build
- Frontend: Vite builds optimized React application to `dist/public`
- Backend: ESBuild bundles Express server to `dist/index.js`
- Database: Drizzle handles schema migrations with `db:push` command

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **OPENAI_API_KEY**: OpenAI API key for website generation
- **NODE_ENV**: Environment flag for development/production behavior

### Development Setup
- Concurrent development with Vite HMR for frontend and tsx for backend
- Database schema synchronization with Drizzle Kit
- Replit-specific integration for cloud development environment

### Architecture Decisions

**Problem**: Need for type-safe data validation across frontend and backend
**Solution**: Shared Zod schemas in `/shared` directory
**Benefits**: Single source of truth for validation rules, automatic TypeScript type generation

**Problem**: Real-time development experience
**Solution**: Vite middleware integration with Express server
**Benefits**: Hot module replacement, fast builds, unified development server

**Problem**: AI content generation reliability
**Solution**: Structured prompts with JSON response format
**Benefits**: Predictable output format, easier error handling, consistent website structure

**Problem**: Database flexibility for different environments
**Solution**: Abstract storage interface with multiple implementations
**Benefits**: Easy testing with memory storage, seamless production database integration