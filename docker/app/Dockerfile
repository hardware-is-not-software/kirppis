FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies for development
RUN apk add --no-cache python3 make g++ git

# Create directories for uploads and logs
RUN mkdir -p /app/uploads /app/logs

# Copy package.json files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
RUN cd client && npm install
RUN cd server && npm install

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000
ENV HOST=0.0.0.0

# Expose port
EXPOSE ${PORT}

# Start the application in development mode
CMD ["npm", "run", "dev"] 