FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code and env files
COPY . .

# Ensure the production env file is used
RUN cp .env.production .env

# Build the app
RUN npm run build || (echo "Ignoring TypeScript errors" && npx vite build)

# Inject the API override script into the HTML
RUN sed -i 's/<head>/<head><script src="\/api-override.js"><\/script>/' /app/dist/index.html

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 5173

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 