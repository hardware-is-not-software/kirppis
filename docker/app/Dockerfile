FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy server code
COPY server/ ./server/
RUN cd server && npm install

# Build server
RUN cd server && npm run build

# Create necessary directories
RUN mkdir -p uploads logs

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0

# Expose port
EXPOSE ${PORT:-3000}

# Start the server
CMD ["node", "server/dist/index.js"] 