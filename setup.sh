#!/bin/bash

# Exit on error
set -e

# Print commands
set -x

# Check if .env file exists, if not create from example
if [ ! -f .env ]; then
  echo "Creating .env file from .env.example"
  cp .env.example .env
fi

# Install dependencies
echo "Installing dependencies..."
npm install
cd server && npm install && cd ..

# Build the server
echo "Building the server..."
cd server && npm run build && cd ..

# Start the server
echo "Starting the server..."
cd server && npm start 
 