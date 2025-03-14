# Image Upload in Docker Environment

This document explains how the image upload functionality has been adapted to work in both local and Docker environments.

## Changes Made

### 1. Server-Side Changes

#### Upload Controller (`server/src/controllers/upload.controller.ts`)
- Updated to use environment variables for the upload directory path
- Added fallback to the original path for local development
- Enhanced logging to include the upload directory path

```typescript
// Define the upload directory - use environment variable if available
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../../uploads');
```

#### Server Configuration (`server/src/index.ts`)
- Updated static file serving to use environment variables
- Added fallback for local development

```typescript
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadDir));
```

### 2. Client-Side Changes

#### Item Form (`client/src/pages/ItemFormPage.tsx`)
- Updated to use the actual `uploadImage` function
- Added error handling for upload failures
- Implemented fallback to local preview if upload fails

### 3. Docker Configuration

#### Server Dockerfile (`server/Dockerfile`)
- Created a dedicated uploads directory
- Set it as a Docker volume for persistence
- Configured environment variables

```dockerfile
# Create uploads directory and set it as a volume
RUN mkdir -p /app/uploads
VOLUME ["/app/uploads"]

# Set environment variables
ENV UPLOAD_DIR=/app/uploads
```

#### Docker Compose (`docker-compose.yml`)
- Configured a persistent volume for uploads
- Mounted the volume to the server container
- Set environment variables for the upload directory

```yaml
volumes:
  - uploads_data:/app/uploads
environment:
  - UPLOAD_DIR=/app/uploads
```

#### Nginx Configuration (`client/nginx.conf`)
- Added proxy configuration for the uploads path
- Ensures uploaded files are accessible from the frontend

```nginx
# Proxy uploads to the backend
location /uploads/ {
    proxy_pass http://server:5000;
    # ... other proxy settings
}
```

## How It Works

1. **Local Development**:
   - Files are uploaded to the `uploads` directory in the project root
   - The server serves these files from the same directory

2. **Docker Environment**:
   - Files are uploaded to the `/app/uploads` directory in the server container
   - This directory is mounted as a Docker volume, ensuring persistence
   - The server serves these files from the same directory
   - Nginx proxies requests for uploaded files to the server

## Testing

### Local Testing
- Run the application locally
- Upload an image in the item form
- Verify the image is saved to the `uploads` directory
- Verify the image is displayed correctly in the item view

### Docker Testing
- Build and run the Docker containers
- Upload an image in the item form
- Verify the image is saved to the Docker volume
- Verify the image is displayed correctly in the item view
- Restart the containers and verify the images are still accessible

## Troubleshooting

### Image Upload Fails
- Check server logs for errors
- Verify the uploads directory exists and is writable
- Check network connectivity between client and server

### Images Not Displayed
- Check browser console for 404 errors
- Verify the file path in the database
- Check nginx configuration for proxy settings 