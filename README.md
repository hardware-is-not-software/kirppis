# Kirppis - Company Internal Second-Hand Store

A web application for managing an internal second-hand store within a company, allowing employees to buy and sell items.

## Features

- User authentication and authorization
- Item listing and management
- Category organization
- Search and filtering capabilities
- Reservation system
- User profiles and history

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication

### Frontend (planned)
- React
- TypeScript
- Tailwind CSS

## Project Structure

```
kirppis/
├── server/             # Backend server
│   ├── src/
│   │   ├── config/     # Configuration files
│   │   ├── controllers/ # Request handlers
│   │   ├── middlewares/ # Express middlewares
│   │   ├── models/     # Mongoose models
│   │   ├── routes/     # API routes
│   │   ├── services/   # Business logic
│   │   ├── types/      # TypeScript type definitions
│   │   ├── utils/      # Utility functions
│   │   └── index.ts    # Entry point
│   ├── package.json
│   └── tsconfig.json
├── client/             # Frontend (to be implemented)
├── .env                # Environment variables
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd kirppis
   ```

2. Install server dependencies
   ```bash
   cd server
   npm install
   ```

3. Set up environment variables
   - Copy `.env.example` to `.env` (if available)
   - Update the values in `.env` file

4. Start MongoDB (if using local instance)
   ```bash
   mongod
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

## Running with Docker vs npm

### Docker Version

The Docker setup provides a containerized environment with separate services for the frontend, backend, and database. This is ideal for production deployments and ensures consistent environments across different machines.

#### Prerequisites for Docker
- Docker (v20.10.0 or higher)
- Docker Compose (v2.0.0 or higher, included with Docker Desktop)

#### Running with Docker
1. Make sure Docker is running on your system
   ```bash
   docker --version
   ```

2. Build and start the containers
   ```bash
   docker compose up -d
   ```

3. Access the application
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001/api/v1

4. Stop the containers
   ```bash
   docker compose down
   ```

5. View logs
   ```bash
   # View all logs
   docker compose logs

   # View specific service logs
   docker logs kirppis-server
   docker logs kirppis-client
   docker logs kirppis-mongo
   ```

#### Docker Volumes
The Docker setup uses persistent volumes to store data:
- `mongo_data`: Stores the MongoDB database files
- `uploads_data`: Stores uploaded files (images, etc.)

These volumes ensure that your data persists even when containers are restarted or rebuilt.

### npm Version

The npm version is ideal for development as it allows for faster iteration and easier debugging.

#### Prerequisites for npm
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm (v7 or higher)

#### Running with npm
1. Install dependencies for both server and client
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

2. Start MongoDB (if using local instance)
   ```bash
   mongod
   ```

3. Start the server in development mode
   ```bash
   cd server
   npm run dev
   ```

4. In a separate terminal, start the client
   ```bash
   cd client
   npm run dev
   ```

5. Access the application
   - Frontend: http://localhost:5173 (default Vite port)
   - Backend API: http://localhost:5000/api/v1

### Switching Between Docker and npm

You can easily switch between Docker and npm versions:

1. To switch from npm to Docker:
   - Stop any running npm processes (Ctrl+C)
   - Run `docker compose up -d`

2. To switch from Docker to npm:
   - Run `docker compose down`
   - Start MongoDB, server, and client with npm as described above

### Environment Variables

Both Docker and npm versions use environment variables for configuration. The Docker version has these variables defined in the `docker-compose.yml` file, while the npm version uses the `.env` file.

Key differences in environment variables:
- Docker: `MONGO_URI=mongodb://mongo:27017/kirppis` (uses the Docker service name)
- npm: `MONGO_URI=mongodb://localhost:27017/kirppis` (uses localhost)

## Deploying to Mirantis Swarm

For production deployment on Mirantis Swarm, we'll use separate stacks for each component (database, server, and client). This approach allows for independent scaling, updates, and maintenance of each component without affecting the others.

### Prerequisites
- Access to a Mirantis Swarm cluster
- Docker registry for storing images
- Swarm overlay network for communication between stacks

### Setting Up the Swarm Network

First, create an overlay network that will be used by all stacks to communicate with each other:

```bash
docker network create --driver overlay --attachable kirppis-network
```

### 1. Database Stack Deployment

The database stack contains only the MongoDB service and its associated volumes.

1. Create a `db-stack.yml` file:
   ```yaml
   version: '3.8'

   services:
     mongo:
       image: mongo:latest
       deploy:
         replicas: 1
         restart_policy:
           condition: on-failure
         update_config:
           parallelism: 1
           delay: 10s
         resources:
           limits:
             cpus: '1'
             memory: 1G
       volumes:
         - mongo_data:/data/db
       environment:
         - MONGO_INITDB_DATABASE=kirppis
       networks:
         - kirppis-network
       healthcheck:
         test: ["CMD", "mongo", "--eval", "db.adminCommand('ping')"]
         interval: 10s
         timeout: 5s
         retries: 5

   volumes:
     mongo_data:
       driver: local

   networks:
     kirppis-network:
       external: true
   ```

2. Deploy the database stack:
   ```bash
   docker stack deploy -c db-stack.yml kirppis-db
   ```

### 2. Server Stack Deployment

The server stack contains the backend API service.

1. Build and push the server image:
   ```bash
   # Build the server image
   docker build -t your-registry.com/kirppis/server:latest ./server

   # Push the image to your registry
   docker push your-registry.com/kirppis/server:latest
   ```

2. Create a `server-stack.yml` file:
   ```yaml
   version: '3.8'

   services:
     server:
       image: your-registry.com/kirppis/server:latest
       deploy:
         replicas: 2
         restart_policy:
           condition: on-failure
         update_config:
           parallelism: 1
           delay: 10s
           order: start-first
         resources:
           limits:
             cpus: '0.5'
             memory: 512M
       environment:
         - NODE_ENV=production
         - PORT=5000
         - HOST=0.0.0.0
         - MONGO_URI=mongodb://mongo:27017/kirppis
         - UPLOAD_DIR=/app/uploads
         - JWT_SECRET_FILE=/run/secrets/jwt_secret
         - JWT_EXPIRES_IN=1d
       volumes:
         - uploads_data:/app/uploads
       networks:
         - kirppis-network
       secrets:
         - jwt_secret
       healthcheck:
         test: ["CMD", "wget", "--spider", "-q", "http://localhost:5000/api/v1/health"]
         interval: 30s
         timeout: 10s
         retries: 3

   volumes:
     uploads_data:
       driver: local

   networks:
     kirppis-network:
       external: true

   secrets:
     jwt_secret:
       external: true
   ```

3. Create the JWT secret:
   ```bash
   echo "your-secure-jwt-secret" | docker secret create jwt_secret -
   ```

4. Deploy the server stack:
   ```bash
   docker stack deploy -c server-stack.yml kirppis-server
   ```

### 3. Client Stack Deployment

The client stack contains the frontend service.

1. Build and push the client image:
   ```bash
   # Build the client image
   docker build -t your-registry.com/kirppis/client:latest ./client

   # Push the image to your registry
   docker push your-registry.com/kirppis/client:latest
   ```

2. Create a `client-stack.yml` file:
   ```yaml
   version: '3.8'

   services:
     client:
       image: your-registry.com/kirppis/client:latest
       deploy:
         replicas: 2
         restart_policy:
           condition: on-failure
         update_config:
           parallelism: 1
           delay: 10s
           order: start-first
         resources:
           limits:
             cpus: '0.3'
             memory: 256M
       ports:
         - "80:5173"
       environment:
         - VITE_API_URL=http://server:5000/api/v1
       networks:
         - kirppis-network
       healthcheck:
         test: ["CMD", "wget", "--spider", "-q", "http://localhost:5173"]
         interval: 30s
         timeout: 10s
         retries: 3

   networks:
     kirppis-network:
       external: true
   ```

3. Deploy the client stack:
   ```bash
   docker stack deploy -c client-stack.yml kirppis-client
   ```

### Managing the Separate Stacks

#### Updating Individual Components

One of the main benefits of separate stacks is the ability to update components independently:

1. Update the server without affecting the database or client:
   ```bash
   # Build and push the new server image
   docker build -t your-registry.com/kirppis/server:v2 ./server
   docker push your-registry.com/kirppis/server:v2

   # Update the server-stack.yml file with the new image tag
   # Then redeploy only the server stack
   docker stack deploy -c server-stack.yml kirppis-server
   ```

2. Update the client without affecting the database or server:
   ```bash
   # Build and push the new client image
   docker build -t your-registry.com/kirppis/client:v2 ./client
   docker push your-registry.com/kirppis/client:v2

   # Update the client-stack.yml file with the new image tag
   # Then redeploy only the client stack
   docker stack deploy -c client-stack.yml kirppis-client
   ```

#### Scaling Individual Components

Scale components based on their specific needs:

```bash
# Scale the server to 4 replicas
docker service scale kirppis-server_server=4

# Scale the client to 3 replicas
docker service scale kirppis-client_client=3
```

#### Monitoring Stack Status

Monitor the status of each stack:

```bash
# List all stacks
docker stack ls

# List services in a specific stack
docker stack services kirppis-db
docker stack services kirppis-server
docker stack services kirppis-client

# Check logs for a specific service
docker service logs kirppis-server_server
docker service logs kirppis-client_client
```

### Security Considerations for Production

For a production deployment, consider these additional security enhancements:

1. Use Docker secrets for all sensitive information
   ```bash
   # Create additional secrets as needed
   echo "mongodb://mongo:27017/kirppis" | docker secret create mongo_uri -
   ```

2. Set up HTTPS with a reverse proxy (like Traefik)
   - Configure Traefik as an edge router
   - Set up automatic SSL certificate management
   - Implement proper HTTP to HTTPS redirection

3. Implement proper monitoring and logging
   - Set up Prometheus for metrics collection
   - Use Grafana for visualization
   - Configure centralized logging with ELK stack

4. Set up database backups
   ```bash
   # Create a backup service in the db stack
   backup:
     image: mongo:latest
     command: sh -c 'mongodump --host mongo --archive=/backup/kirppis-$$(date +%Y%m%d%H%M).archive'
     volumes:
       - backup_data:/backup
     networks:
       - kirppis-network
     deploy:
       restart_policy:
         condition: none
   ```

## API Endpoints

The API will be available at `http://localhost:5000/api/v1` (npm version) or `http://localhost:5001/api/v1` (Docker version)

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout

### Users
- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (admin only)

### Items
- `GET /api/v1/items` - Get all items
- `GET /api/v1/items/:id` - Get item by ID
- `POST /api/v1/items` - Create new item
- `PATCH /api/v1/items/:id` - Update item
- `DELETE /api/v1/items/:id` - Delete item

### Categories
- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/:id` - Get category by ID
- `POST /api/v1/categories` - Create new category (admin only)
- `PATCH /api/v1/categories/:id` - Update category (admin only)
- `DELETE /api/v1/categories/:id` - Delete category (admin only)

## License

This project is licensed under the MIT License.

## Port Configuration

### Local Development
- **Server**: Runs on port 5000
- **Client**: Runs on port 5173
- **API URL**: http://localhost:5000/api/v1
- **MongoDB**: Runs on port 27017

### Docker Environment
- **Server**: Container port 5000 mapped to host port 5001
- **Client**: Runs on port 5173
- **API URL**: http://localhost:5001/api/v1
- **MongoDB**: Container port 27017 mapped to host port 27018

## Environment Variables

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api/v1  # For local development
VITE_API_URL=http://localhost:5001/api/v1  # For Docker environment
```

### Server (.env)
```
PORT=5000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5001
```

## Running the Application

### Local Development
1. Start MongoDB
2. Start the server: `cd server && npm run dev`
3. Start the client: `cd client && npm run dev`

### Docker Environment
1. Build the images: `cd deploy && docker compose build`
2. Start the containers: `cd deploy && docker compose up -d`

## Troubleshooting

### CORS Issues
If you encounter CORS issues:
1. Check that the server's CORS configuration includes all necessary origins
2. Ensure the client is using the correct API URL
3. Verify that the server is running on the expected port

### Port Conflicts
If you have port conflicts:
1. Check if another process is using the required ports
2. Update the port configuration in the appropriate files


Notes by human:
docker setup:
docker compose up --build server client
or
docker compose up --build --no-deps server client

local:
docker compose up -d mongo
cd server
npm run dev
cd ../client
npm run dev


