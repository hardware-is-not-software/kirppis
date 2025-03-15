# Kirppis Deployment Files

This directory contains the necessary files to deploy the Kirppis application on a Mirantis Swarm cluster as separate stacks for each component.

## Files

- `db-stack.yml` - Stack file for the MongoDB database
- `server-stack.yml` - Stack file for the backend API server
- `client-stack.yml` - Stack file for the frontend client
- `deploy.sh` - Helper script for deploying the stacks

## Deployment Architecture

The deployment is split into three separate stacks:

1. **Database Stack (kirppis-db)**
   - MongoDB service
   - Optional backup service (disabled by default)
   - Persistent volume for data storage

2. **Server Stack (kirppis-server)**
   - Node.js backend API service
   - JWT authentication using Docker secrets
   - Persistent volume for file uploads

3. **Client Stack (kirppis-client)**
   - React frontend service
   - Nginx-based static file serving
   - Optional Traefik integration for production

All stacks communicate through a shared overlay network (`kirppis-network`).

## Deployment Instructions

### Prerequisites

- A Mirantis Swarm cluster
- Docker registry for storing images
- Docker CLI with Swarm mode enabled

### Quick Start

The easiest way to deploy is using the provided script:

```bash
# Create the network
./deploy.sh network

# Create required secrets
./deploy.sh secrets

# Deploy all stacks
./deploy.sh all

# Check status
./deploy.sh status
```

### Manual Deployment

If you prefer to deploy manually:

1. Create the overlay network:
   ```bash
   docker network create --driver overlay --attachable kirppis-network
   ```

2. Create required secrets:
   ```bash
   echo "your-jwt-secret" | docker secret create jwt_secret -
   ```

3. Deploy each stack:
   ```bash
   docker stack deploy -c db-stack.yml kirppis-db
   docker stack deploy -c server-stack.yml kirppis-server
   docker stack deploy -c client-stack.yml kirppis-client
   ```

## Environment Variables

The stack files support the following environment variables:

- `REGISTRY_URL` - Docker registry URL (default: localhost)
- `SERVER_TAG` - Server image tag (default: latest)
- `CLIENT_TAG` - Client image tag (default: latest)
- `SERVER_REPLICAS` - Number of server replicas (default: 2)
- `CLIENT_REPLICAS` - Number of client replicas (default: 2)
- `DOMAIN` - Domain name for the application (default: kirppis.example.com)
- `PUBLIC_PORT` - Public port for the client (default: 80)

Example:
```bash
export REGISTRY_URL=registry.example.com
export SERVER_TAG=v1.2.3
./deploy.sh server
```

## Updating Components

One of the main benefits of separate stacks is the ability to update components independently:

### Update the Server

```bash
# Build and push the new server image
docker build -t registry.example.com/kirppis/server:v1.2.3 ./server
docker push registry.example.com/kirppis/server:v1.2.3

# Deploy only the server stack with the new image
export REGISTRY_URL=registry.example.com
export SERVER_TAG=v1.2.3
./deploy.sh server
```

### Update the Client

```bash
# Build and push the new client image
docker build -t registry.example.com/kirppis/client:v2.0.0 ./client
docker push registry.example.com/kirppis/client:v2.0.0

# Deploy only the client stack with the new image
export REGISTRY_URL=registry.example.com
export CLIENT_TAG=v2.0.0
./deploy.sh client
```

## Scaling

Scale components based on their specific needs:

```bash
# Scale the server to 4 replicas
docker service scale kirppis-server_server=4

# Scale the client to 3 replicas
docker service scale kirppis-client_client=3
```

## Monitoring

Monitor the status of each stack:

```bash
# Show status of all stacks
./deploy.sh status

# View logs for the server
./deploy.sh logs server

# View logs for the database
./deploy.sh logs db

# View logs for the client
./deploy.sh logs client
```

## Production Considerations

For production deployments:

1. Enable MongoDB authentication by uncommenting the relevant sections in `db-stack.yml` and `deploy.sh`
2. Set up HTTPS with Traefik by uncommenting the relevant sections in `client-stack.yml`
3. Enable the backup service in `db-stack.yml`
4. Use a proper Docker registry instead of localhost
5. Consider setting up monitoring with Prometheus and Grafana
6. Set up centralized logging with ELK stack 