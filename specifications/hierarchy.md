# Project Directory Structure

This document outlines the recommended directory and file structure for the second-hand store application, following modern best practices for a maintainable Next.js and Express application.

## Root Structure

```
/
├── client/                     # Frontend Next.js application
├── server/                     # Backend Express API
├── docker/                     # Docker configuration files
├── scripts/                    # Utility scripts
├── specifications/             # Project documentation
├── .env.example                # Example environment variables
├── .gitignore                  # Git ignore file
├── docker-compose.yml          # Main Docker Compose file
├── docker-compose.override.yml # Local development overrides
├── README.md                   # Project readme
└── package.json                # Root package.json for scripts
```

## Frontend (client/)

```
client/
├── public/                     # Static assets
│   ├── images/                 # Images (including logos)
│   │   ├── images/                 # Images (including logos)
│   │   └── favicon.ico             # Favicon
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── auth/               # Authentication components
│   │   │   ├── common/             # Common UI components
│   │   │   ├── layout/             # Layout components
│   │   │   ├── listings/           # Listing-related components
│   │   │   ├── profile/            # User profile components
│   │   │   └── ui/                 # UI library components
│   │   ├── contexts/               # React contexts
│   │   │   ├── AuthContext.tsx     # Auth context
│   │   │   └── UIContext.tsx       # UI state context
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── useAuth.ts          # Auth hook
│   │   │   ├── useListings.ts      # Listings data hook
│   │   │   └── useCategories.ts    # Categories hook
│   │   ├── lib/                    # Utility libraries
│   │   │   ├── api.ts              # API client
│   │   │   └── helpers.ts          # Helper functions
│   │   ├── pages/                  # Next.js pages
│   │   │   ├── _app.tsx            # App component
│   │   │   ├── _document.tsx       # Document component
│   │   │   ├── index.tsx           # Homepage
│   │   │   ├── auth/               # Auth pages
│   │   │   │   ├── login.tsx       # Login page
│   │   │   │   └── register.tsx    # Registration page
│   │   │   ├── listings/           # Listing pages
│   │   │   │   ├── index.tsx       # All listings
│   │   │   │   ├── [id].tsx        # Single listing page
│   │   │   │   ├── create.tsx      # Create listing
│   │   │   │   └── edit/[id].tsx   # Edit listing
│   │   │   ├── profile/            # Profile pages
│   │   │   │   ├── index.tsx       # Profile view
│   │   │   │   └── edit.tsx        # Edit profile
│   │   │   ├── admin/              # Admin pages
│   │   │   │   └── index.tsx       # Admin dashboard
│   │   │   └── api/                # API routes
│   │   │       └── auth/           # Auth API routes
│   │   ├── styles/                 # Stylesheets
│   │   │   ├── globals.css         # Global styles
│   │   │   └── tailwind.css        # Tailwind imports
│   │   ├── types/                  # TypeScript type definitions
│   │   │   ├── auth.ts             # Auth types
│   │   │   ├── listing.ts          # Listing types
│   │   │   └── user.ts             # User types
│   │   └── utils/                  # Utility functions
│   │       ├── auth.ts             # Auth utilities
│   │       ├── formatting.ts       # Text/date formatting
│   │       └── validation.ts       # Form validation
│   ├── .eslintrc.js                # ESLint config
│   ├── .prettierrc                 # Prettier config
│   ├── next.config.js              # Next.js config
│   ├── package.json                # Dependencies
│   ├── postcss.config.js           # PostCSS config
│   ├── tailwind.config.js          # Tailwind CSS config
│   └── tsconfig.json               # TypeScript config
```

## Backend (server/)

```
server/
├── src/
│   ├── config/                 # Configuration
│   │   ├── db.ts               # Database connection
│   │   ├── env.ts              # Environment variables
│   │   ├── logging.ts          # Logging config
│   │   └── openid.ts           # OpenID config
│   ├── controllers/            # Route controllers
│   │   ├── auth.controller.ts  # Auth controller
│   │   ├── listing.controller.ts # Listing controller
│   │   └── user.controller.ts  # User controller
│   ├── middlewares/            # Express middlewares
│   │   ├── auth.middleware.ts  # Auth middleware
│   │   ├── error.middleware.ts # Error handling
│   │   └── validation.middleware.ts # Input validation
│   ├── models/                 # Data models
│   │   ├── category.model.ts   # Category model
│   │   ├── listing.model.ts    # Listing model
│   │   ├── location.model.ts   # Location model
│   │   └── user.model.ts       # User model
│   ├── routes/                 # API routes
│   │   ├── auth.routes.ts      # Auth routes
│   │   ├── index.ts            # Route index
│   │   ├── listing.routes.ts   # Listing routes
│   │   └── user.routes.ts      # User routes
│   ├── services/               # Business logic
│   │   ├── auth.service.ts     # Auth service
│   │   ├── listing.service.ts  # Listing service
│   │   ├── search.service.ts   # Search service
│   │   └── user.service.ts     # User service
│   ├── types/                  # TypeScript types
│   │   ├── express.d.ts        # Express type extensions
│   │   └── index.ts            # Type index
│   ├── utils/                  # Utilities
│   │   ├── logger.ts           # Logging utility
│   │   ├── fileStorage.ts      # File upload handling
│   │   └── validators.ts       # Input validators
│   ├── app.ts                  # Express app setup
│   └── index.ts                # Server entry point
├── .eslintrc.js                # ESLint config
├── jest.config.js              # Jest config
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
└── nodemon.json                # Nodemon config
```

## Docker Configuration (docker/)

```
docker/
├── app/                        # App container config
│   └── Dockerfile              # App Dockerfile
├── database/                   # Database container config
│   ├── Dockerfile              # DB Dockerfile
│   └── init-scripts/           # DB initialization scripts
├── search/                     # Search container config
│   └── Dockerfile              # Meilisearch Dockerfile
├── development/                # Development environment
│   └── docker-compose.dev.yml  # Development compose
├── production/                 # Production environment
│   └── docker-compose.prod.yml # Production compose
└── common-services.yml         # Common service definitions
```

## Scripts (scripts/)

```
scripts/
├── deploy.sh                   # Deployment script
├── setup-dev.sh                # Development setup
├── seed-db.js                  # Database seeding
└── backup.sh                   # Backup script
```

## Configuration Files

### docker-compose.yml (Example)
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: docker/app/Dockerfile
    ports:
      - "${PORT}:${PORT}"
    depends_on:
      - mongodb
      - meilisearch
    env_file: .env
    volumes:
      - app_uploads:/app/uploads
      - app_logs:/app/logs

  mongodb:
    build:
      context: ./docker/database
    volumes:
      - mongodb_data:/data/db
    env_file: .env

  meilisearch:
    build:
      context: ./docker/search
    volumes:
      - meilisearch_data:/data.ms
    env_file: .env

volumes:
  app_uploads:
  app_logs:
  mongodb_data:
  meilisearch_data:
```

### Dockerfile for App (Example)
```Dockerfile
FROM node:18-alpine as base

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine as production

WORKDIR /app

# Copy built artifacts
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY package*.json ./

# Set environment
ENV NODE_ENV=production

# Create volume mounts
VOLUME ["/app/uploads", "/app/logs"]

# Run application
CMD ["node", "dist/index.js"]
```

## Unit Testing Structure

```
client/src/__tests__/           # Frontend tests
  ├── components/               # Component tests
  ├── hooks/                    # Hook tests
  └── utils/                    # Utility tests

server/src/__tests__/           # Backend tests
  ├── controllers/              # Controller tests
  ├── services/                 # Service tests
  └── utils/                    # Utility tests
```

## Integration Testing Structure

```
tests/
├── api/                        # API tests
│   ├── auth.test.ts            # Auth API tests
│   └── listing.test.ts         # Listing API tests
├── e2e/                        # E2E tests
│   ├── auth.spec.ts            # Auth flow tests
│   └── listing.spec.ts         # Listing flow tests
└── fixtures/                   # Test fixtures
    ├── users.json              # User test data
    └── listings.json           # Listing test data
```

## Key Benefits of this Structure

1. **Separation of Concerns**
   - Clear separation between client and server
   - Modular architecture for easy maintenance

2. **Scalability**
   - Components organized by feature for easier scaling
   - Services separated from controllers for business logic reuse

3. **Developer Experience**
   - Consistent naming conventions
   - Intuitive navigation through project structure

4. **Deployment-Ready**
   - Docker configuration for different environments
   - Configuration via environment variables

5. **Maintainability**
   - Tests co-located with implementation (where appropriate)
   - TypeScript types for better code quality 