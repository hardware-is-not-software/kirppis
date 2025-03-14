# Running Kirppis in Docker

This document provides instructions on how to run the Kirppis application in a Docker environment.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd kirppis
   ```

2. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api/v1

## Configuration

The Docker setup includes:

- MongoDB database
- Node.js backend server
- React frontend client
- Persistent volumes for database and uploads

### Environment Variables

You can customize the application by modifying the environment variables in the `docker-compose.yml` file:

#### Server
- `NODE_ENV`: Production or development mode
- `PORT`: The port the server listens on
- `HOST`: The host the server binds to
- `MONGO_URI`: MongoDB connection string
- `UPLOAD_DIR`: Directory for file uploads

#### Client
- `VITE_API_URL`: URL of the backend API

## File Uploads

File uploads are stored in a Docker volume named `uploads_data`. This ensures that uploaded files persist even when containers are restarted.

## Troubleshooting

### Cannot connect to the database
- Ensure MongoDB container is running: `docker ps`
- Check MongoDB logs: `docker logs kirppis-mongo`

### File uploads not working
- Check server logs: `docker logs kirppis-server`
- Verify the uploads volume is mounted correctly: `docker volume inspect uploads_data`

### Frontend not loading
- Check client logs: `docker logs kirppis-client`
- Verify the nginx configuration: `docker exec -it kirppis-client cat /etc/nginx/conf.d/default.conf`

## Development in Docker

For development, you can mount your local source code into the containers:

```yaml
services:
  server:
    volumes:
      - ./server:/app
      - /app/node_modules
      - uploads_data:/app/uploads
    command: npm run dev

  client:
    volumes:
      - ./client:/app
      - /app/node_modules
    command: npm run dev
```

This allows you to make changes to the code and see them reflected immediately without rebuilding the containers. 