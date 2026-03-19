# Budget Bit - Makefile
# Provides convenient commands for common tasks

.PHONY: help install install-ai test test-client test-ai build build-docker up down clean lint

# Default target
help:
	@echo "Budget Bit - Available Commands:"
	@echo ""
	@echo "  make install        Install all dependencies"
	@echo "  make install-ai     Install AI service dependencies"
	@echo "  make test           Run all tests"
	@echo "  make test-client    Run React client tests"
	@echo "  make test-ai        Run AI service tests"
	@echo "  make lint           Run linter"
	@echo "  make build          Build for production"
	@echo "  make build-docker   Build Docker images"
	@echo "  make up             Start all services (Docker Compose)"
	@echo "  make down           Stop all services"
	@echo "  make clean          Remove build artifacts"

# Install dependencies
install:
	cd client && npm install
	cd server && npm install
	pip install -r ai/requirements.txt

# Install AI dependencies
install-ai:
	pip install -r ai/requirements.txt
	pip install -r ai/requirements-test.txt

# Run all tests
test: test-client test-ai

# Client tests
test-client:
	cd client && npm run test -- --run

# AI tests
test-ai:
	cd ai && pytest tests/ -v

# Lint
lint:
	cd client && npm run lint

# Build for production
build:
	cd client && npm run build

# Build Docker images
build-docker:
	./scripts/build-docker.sh

# Start services
up:
	docker-compose up -d

# Stop services
down:
	docker-compose down

# Clean build artifacts
clean:
	cd client && rm -rf dist node_modules/.vite
	cd server && rm -rf node_modules
	cd ai && rm -rf __pycache__ .pytest_cache htmlcov
	rm -rf coverage.xml .coverage
	docker system prune -f
