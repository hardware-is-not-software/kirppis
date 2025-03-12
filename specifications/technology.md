# Technology Stack Recommendation

This document outlines the recommended technologies for building the company internal second-hand store application based on the requirements.

## Overview

We recommend a modern, containerized architecture that allows for:
- Easy deployment to Mirantis swarm cluster (R1.0)
- Local development with Docker Compose (R1.1)
- Separation of database and application (R1.2)
- Exclusively using free open-source technologies

## Frontend

### Recommended: Next.js with TypeScript
- **Why**: Next.js is an open-source React framework with excellent performance
- **Benefits**:
  - TypeScript adds static typing for better code quality
  - Built-in routing system
  - API routes for backend functionality
  - Active development community
  - Free and open-source

### UI Framework
- **Recommended**: Tailwind CSS with daisyUI
  - Both are free and open-source
  - Tailwind provides utility-first CSS that's highly customizable
  - daisyUI adds accessible components while keeping the flexibility of Tailwind

### State Management
- **Recommended**: React Query + Context API or Zustand
  - All are free and open-source options
  - React Query for server state management
  - Context API (built into React) or Zustand for client-side state

## Backend

### API Framework
- **Recommended**: Node.js with Express
  - Free and open-source with large community
  - Lightweight and flexible
  - Extensive middleware ecosystem
  - Good support for OpenID Connect integration

### Authentication
- **Recommended**: OpenID Connect (OIDC) with Passport.js
  - Primary authentication through Azure AD (R0.1, R0.2)
  - Secondary option for email/password login (R0.3, R0.5)
  - Implementation following the approach in the provided .env.example

#### OpenID Connect Configuration
We'll use a configuration pattern similar to the provided example:
```
# OpenID Configuration
OPENID_CLIENT_ID=           # Azure AD client ID
OPENID_CLIENT_SECRET=       # Azure AD client secret
OPENID_ISSUER=              # Azure AD issuer URL
OPENID_SESSION_SECRET=      # Secret for session encryption
OPENID_SCOPE="openid profile email"  # Scopes to request
OPENID_CALLBACK_URL=/oauth/openid/callback  # Redirect URL after auth
OPENID_USERNAME_CLAIM=      # Which OIDC claim to use as username
OPENID_NAME_CLAIM=          # Which OIDC claim to use as display name

# UI Customization for Login
OPENID_BUTTON_LABEL="Sign in with Azure AD"
OPENID_IMAGE_URL="/images/azure-logo.png"

# Optional Role-Based Access (if needed)
OPENID_REQUIRED_ROLE=       # Role required for access
OPENID_REQUIRED_ROLE_TOKEN_KIND=  # Token type to check for role
OPENID_REQUIRED_ROLE_PARAMETER_PATH=  # Path to check for role in token
```

#### Authentication Flow
1. User clicks the Azure AD login button (customizable via env vars)
2. User is redirected to Azure AD for authentication
3. After successful authentication, user is redirected back with identity token
4. Application verifies the token and extracts user information
5. User session is created
6. Fallback to email/password login if Azure AD is unavailable or for non-company users

## Database

### Primary Database
- **Recommended**: MongoDB
  - Free, open-source NoSQL database
  - Good for document-oriented data like listings with varying attributes
  - Flexible schema works well for adding categories/locations without data migration (R2.2)

### Search Capabilities
- **Recommended**: Meilisearch
  - Free, open-source search engine
  - Great for implementing the search and filter requirements (R3.2)
  - Lightweight and easy to deploy in a container

## File Storage

### Recommended: Docker Volumes on Swarm
- Use named volumes in Docker Swarm for persistent storage
- Benefits:
  - Native to the Mirantis swarm environment
  - No additional services required
  - Suitable for storing:
    - User profile pictures (R0.8, R0.9)
    - Post images (R3.4)
    - Documents (R3.5)

- For better performance and scalability, consider:
  - Volume drivers that support distributed storage in Swarm
  - Local bind mounts during development

## Deployment & DevOps

### Containerization
- Docker for containerization (R1.1)
- Docker Compose for local development
- Docker Swarm for production deployment on Mirantis (R1.0)
- Separate deployment scripts for database and application (R1.3)

### Container Structure
- Main application container
- MongoDB container
- Meilisearch container
- Shared volumes between containers

### Configuration Management
- Environment variables via .env files (R1.4, R1.5, R2.0, R2.1, R2.3)
- Docker secrets for sensitive information in production
- Docker configs for non-sensitive configuration

## Monitoring & Logging

### Logging
- Winston for application logging (free and open-source)
- Configurable logging levels that can be disabled via .env (R1.4)
- Logs stored in a volume

### Monitoring
- Prometheus for metrics collection (free and open-source)
- Grafana for visualization (free and open-source)

## Development Tools

### Code Quality
- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks
- All free and open-source

### Testing
- Jest for unit and integration testing
- Cypress for E2E testing
- All free and open-source

## Mirantis Swarm Considerations

Based on Mirantis Docker Enterprise limitations:

1. **Container Orchestration**:
   - Ensure images are compatible with Mirantis Docker Enterprise
   - Use appropriate restart policies

2. **Networking**:
   - Define clear service dependencies (depends_on)
   - Use internal service discovery for microservices communication

3. **Volume Management**:
   - Use named volumes for persistent data
   - Consider volume drivers compatible with Mirantis infrastructure

4. **Resource Allocation**:
   - Configure appropriate resource limits for containers
   - Consider Mirantis-specific resource constraints

5. **User Permissions**:
   - Implement user and group ID mapping
   - Use the "user" directive to control container privileges

## Example Docker Compose Structure

```yaml
services:
  app:
    container_name: SecondHandStore
    ports:
      - "${PORT}:${PORT}"
    depends_on:
      - mongodb
      - meilisearch
    restart: always
    user: "${UID}:${GID}"
    environment:
      - HOST=0.0.0.0
      - MONGO_URI=mongodb://mongodb:27017/SecondHandStore
      - MEILI_HOST=http://meilisearch:7700
      # OpenID Environment Variables
      - OPENID_CLIENT_ID=${OPENID_CLIENT_ID}
      - OPENID_CLIENT_SECRET=${OPENID_CLIENT_SECRET}
      - OPENID_ISSUER=${OPENID_ISSUER}
      - OPENID_SESSION_SECRET=${OPENID_SESSION_SECRET}
      - OPENID_SCOPE=${OPENID_SCOPE}
      - OPENID_CALLBACK_URL=${OPENID_CALLBACK_URL}
      - OPENID_USERNAME_CLAIM=${OPENID_USERNAME_CLAIM}
      - OPENID_NAME_CLAIM=${OPENID_NAME_CLAIM}
      - OPENID_BUTTON_LABEL=${OPENID_BUTTON_LABEL}
      - OPENID_IMAGE_URL=${OPENID_IMAGE_URL}
    volumes:
      - type: bind
        source: ./.env
        target: /app/.env
      - ./images:/app/public/images
      - ./uploads:/app/uploads
      - ./logs:/app/logs

  mongodb:
    container_name: store-mongodb
    image: mongo
    restart: always
    user: "${UID}:${GID}"
    volumes:
      - mongodb_data:/data/db

  meilisearch:
    container_name: store-meilisearch
    image: getmeili/meilisearch:latest
    restart: always
    user: "${UID}:${GID}"
    environment:
      - MEILI_HOST=http://meilisearch:7700
      - MEILI_NO_ANALYTICS=true
      - MEILI_MASTER_KEY=${MEILI_MASTER_KEY}
    volumes:
      - meilisearch_data:/meili_data

volumes:
  mongodb_data:
  meilisearch_data:
```

## Sample .env Structure

```
# Server Configuration
PORT=3000
HOST=0.0.0.0
NODE_ENV=development

# User IDs for Docker
UID=1000
GID=1000

# Database
MONGO_URI=mongodb://mongodb:27017/SecondHandStore

# Search
MEILI_MASTER_KEY=your-master-key-here

# OpenID Configuration
OPENID_CLIENT_ID=your-azure-client-id
OPENID_CLIENT_SECRET=your-azure-client-secret
OPENID_ISSUER=https://login.microsoftonline.com/your-tenant-id/v2.0
OPENID_SESSION_SECRET=your-session-secret
OPENID_SCOPE="openid profile email"
OPENID_CALLBACK_URL=/oauth/openid/callback
OPENID_USERNAME_CLAIM=preferred_username
OPENID_NAME_CLAIM=name
OPENID_BUTTON_LABEL="Sign in with Azure AD"
OPENID_IMAGE_URL="/images/azure-logo.png"

# Admin Configuration
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password-hash

# App Configuration
APP_NAME="Company Second-Hand Store"
LOGO_URL="/images/company-logo.png"

# Categories (comma-separated)
CATEGORIES=Electronics,Furniture,Clothing,Books,Sports,Other

# Locations (comma-separated)
LOCATIONS=Building A,Building B,Office 1,Office 2,Remote

# Logging
ENABLE_LOGGING=true
LOG_LEVEL=info
```

## Recommendation Summary

For a maintainable, scalable internal second-hand store that meets all requirements using only free open-source technology:

1. **Frontend**: Next.js + TypeScript + Tailwind CSS + daisyUI
2. **Backend**: Node.js with Express
3. **Database**: MongoDB
4. **Search**: Meilisearch
5. **File Storage**: Docker volumes on Swarm
6. **Deployment**: Docker + Docker Compose + Docker Swarm on Mirantis
7. **Authentication**: OpenID Connect with Azure AD integration

This stack is:
- Fully open-source and free
- Compatible with Mirantis swarm environment
- Implements OpenID Connect authentication similar to the provided example
- Aligned with all specified requirements 