#!/bin/bash
# Script for local testing of the Kirppis application using Docker Compose

# Exit on error
set -e

# Display help message
show_help() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  build       Build the Docker images"
    echo "  up          Start the containers"
    echo "  down        Stop the containers"
    echo "  restart     Restart the containers"
    echo "  logs        Show logs"
    echo "  status      Show status of containers"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build    # Build the Docker images"
    echo "  $0 up       # Start the containers"
    echo "  $0 logs     # Show logs"
}

# Build the Docker images
build_images() {
    echo "Building server image..."
    cd ../server && docker build -t localhost/kirppis/server:latest .
    
    echo "Building client image..."
    cd ../client && docker build -t localhost/kirppis/client:latest .
    
    echo "Images built successfully!"
}

# Start the containers
start_containers() {
    echo "Starting containers..."
    docker compose up -d
    echo "Containers started!"
    echo "Frontend: http://localhost:5173"
    echo "Backend API: http://localhost:5001/api/v1"
    echo "MongoDB: localhost:27018"
}

# Stop the containers
stop_containers() {
    echo "Stopping containers..."
    docker compose down
    echo "Containers stopped!"
}

# Restart the containers
restart_containers() {
    echo "Restarting containers..."
    docker compose restart
    echo "Containers restarted!"
}

# Show logs
show_logs() {
    echo "Showing logs..."
    docker compose logs -f
}

# Show status
show_status() {
    echo "Container status:"
    docker compose ps
}

# Parse command
case "$1" in
    build)
        build_images
        ;;
    up)
        start_containers
        ;;
    down)
        stop_containers
        ;;
    restart)
        restart_containers
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    help|*)
        show_help
        ;;
esac 