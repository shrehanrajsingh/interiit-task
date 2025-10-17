#!/bin/bash

# Helper script for Docker operations

case "$1" in
  dev)
    echo "Starting development environment..."
    docker-compose -f docker-compose.dev.yml up --build
    ;;
  prod)
    echo "Starting production environment..."
    docker-compose up --build
    ;;
  down)
    echo "Stopping containers..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    ;;
  clean)
    echo "Cleaning Docker resources..."
    docker-compose down --volumes --rmi local
    docker-compose -f docker-compose.dev.yml down --volumes --rmi local
    ;;
  backend)
    echo "Starting backend only..."
    docker-compose up --build backend
    ;;
  frontend)
    echo "Starting frontend only..."
    docker-compose up --build frontend
    ;;
  rebuild)
    echo "Rebuilding containers with no cache..."
    docker-compose build --no-cache
    docker-compose up
    ;;
  *)
    echo "Usage: $0 {dev|prod|down|clean|backend|frontend|rebuild}"
    echo ""
    echo "  dev: Start development environment"
    echo "  prod: Start production environment"
    echo "  down: Stop all containers"
    echo "  clean: Remove containers, volumes, and images"
    echo "  backend: Start backend only"
    echo "  frontend: Start frontend only"
    echo "  rebuild: Rebuild containers with no cache"
    exit 1
    ;;
esac

exit 0