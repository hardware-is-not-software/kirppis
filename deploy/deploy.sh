#!/bin/bash
# Deployment script for Kirppis application on Mirantis Swarm

# Exit on error
set -e

# Default values
REGISTRY_URL=${REGISTRY_URL:-"localhost"}
SERVER_TAG=${SERVER_TAG:-"latest"}
CLIENT_TAG=${CLIENT_TAG:-"latest"}
SERVER_REPLICAS=${SERVER_REPLICAS:-2}
CLIENT_REPLICAS=${CLIENT_REPLICAS:-2}
DOMAIN=${DOMAIN:-"kirppis.example.com"}
PUBLIC_PORT=${PUBLIC_PORT:-80}

# Display help message
show_help() {
    echo "Usage: $0 [options] [command]"
    echo ""
    echo "Commands:"
    echo "  network       Create the overlay network"
    echo "  secrets       Create required secrets"
    echo "  db            Deploy the database stack"
    echo "  server        Deploy the server stack"
    echo "  client        Deploy the client stack"
    echo "  all           Deploy all stacks"
    echo "  status        Show status of all stacks"
    echo "  logs          Show logs for a specific service (db, server, client)"
    echo ""
    echo "Options:"
    echo "  --registry    Docker registry URL (default: localhost)"
    echo "  --server-tag  Server image tag (default: latest)"
    echo "  --client-tag  Client image tag (default: latest)"
    echo "  --domain      Domain name for the application (default: kirppis.example.com)"
    echo "  --port        Public port for the client (default: 80)"
    echo "  --help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 network                                # Create the network"
    echo "  $0 secrets                                # Create required secrets"
    echo "  $0 --registry registry.example.com all    # Deploy all stacks with custom registry"
    echo "  $0 --server-tag v1.2.3 server            # Deploy server with specific tag"
    echo "  $0 status                                 # Show status of all stacks"
    echo "  $0 logs server                           # Show logs for the server service"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --registry)
            REGISTRY_URL="$2"
            shift 2
            ;;
        --server-tag)
            SERVER_TAG="$2"
            shift 2
            ;;
        --client-tag)
            CLIENT_TAG="$2"
            shift 2
            ;;
        --domain)
            DOMAIN="$2"
            shift 2
            ;;
        --port)
            PUBLIC_PORT="$2"
            shift 2
            ;;
        --help)
            show_help
            exit 0
            ;;
        *)
            COMMAND="$1"
            shift
            ;;
    esac
done

# Export variables for docker-compose
export REGISTRY_URL
export SERVER_TAG
export CLIENT_TAG
export SERVER_REPLICAS
export CLIENT_REPLICAS
export DOMAIN
export PUBLIC_PORT

# Create network
create_network() {
    echo "Creating overlay network: kirppis-network"
    docker network create --driver overlay --attachable kirppis-network || echo "Network already exists"
}

# Create secrets
create_secrets() {
    echo "Creating required secrets"
    
    # Check if secrets already exist
    if docker secret inspect jwt_secret &>/dev/null; then
        echo "JWT secret already exists"
    else
        echo "Creating JWT secret"
        read -p "Enter JWT secret (or press enter for random): " JWT_SECRET
        if [ -z "$JWT_SECRET" ]; then
            JWT_SECRET=$(openssl rand -base64 32)
        fi
        echo "$JWT_SECRET" | docker secret create jwt_secret -
    fi
    
    # Uncomment for MongoDB authentication in production
    # if docker secret inspect mongo_root_username &>/dev/null; then
    #     echo "MongoDB root username secret already exists"
    # else
    #     echo "Creating MongoDB root username secret"
    #     read -p "Enter MongoDB root username: " MONGO_ROOT_USERNAME
    #     echo "$MONGO_ROOT_USERNAME" | docker secret create mongo_root_username -
    # fi
    # 
    # if docker secret inspect mongo_root_password &>/dev/null; then
    #     echo "MongoDB root password secret already exists"
    # else
    #     echo "Creating MongoDB root password secret"
    #     read -p "Enter MongoDB root password (or press enter for random): " MONGO_ROOT_PASSWORD
    #     if [ -z "$MONGO_ROOT_PASSWORD" ]; then
    #         MONGO_ROOT_PASSWORD=$(openssl rand -base64 32)
    #     fi
    #     echo "$MONGO_ROOT_PASSWORD" | docker secret create mongo_root_password -
    # fi
}

# Deploy database stack
deploy_db() {
    echo "Deploying database stack"
    docker stack deploy -c db-stack.yml kirppis-db
}

# Deploy server stack
deploy_server() {
    echo "Deploying server stack with image: $REGISTRY_URL/kirppis/server:$SERVER_TAG"
    docker stack deploy -c server-stack.yml kirppis-server
}

# Deploy client stack
deploy_client() {
    echo "Deploying client stack with image: $REGISTRY_URL/kirppis/client:$CLIENT_TAG"
    docker stack deploy -c client-stack.yml kirppis-client
}

# Show status of all stacks
show_status() {
    echo "Stacks:"
    docker stack ls | grep kirppis
    
    echo -e "\nServices:"
    docker service ls | grep kirppis
    
    echo -e "\nNetworks:"
    docker network ls | grep kirppis
    
    echo -e "\nVolumes:"
    docker volume ls | grep kirppis
    
    echo -e "\nSecrets:"
    docker secret ls | grep kirppis
}

# Show logs for a specific service
show_logs() {
    case $1 in
        db)
            docker service logs kirppis-db_mongo
            ;;
        server)
            docker service logs kirppis-server_server
            ;;
        client)
            docker service logs kirppis-client_client
            ;;
        *)
            echo "Unknown service: $1"
            echo "Available services: db, server, client"
            exit 1
            ;;
    esac
}

# Execute command
case $COMMAND in
    network)
        create_network
        ;;
    secrets)
        create_secrets
        ;;
    db)
        deploy_db
        ;;
    server)
        deploy_server
        ;;
    client)
        deploy_client
        ;;
    all)
        create_network
        create_secrets
        deploy_db
        deploy_server
        deploy_client
        ;;
    status)
        show_status
        ;;
    logs)
        if [ -z "$1" ]; then
            echo "Please specify a service: db, server, or client"
            exit 1
        fi
        show_logs "$1"
        ;;
    *)
        show_help
        exit 1
        ;;
esac

echo "Done!" 