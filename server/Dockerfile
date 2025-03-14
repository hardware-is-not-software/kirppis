FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create uploads directory and set it as a volume
RUN mkdir -p /app/uploads
VOLUME ["/app/uploads"]

# Set environment variables
ENV NODE_ENV=production
ENV UPLOAD_DIR=/app/uploads

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "start"] 