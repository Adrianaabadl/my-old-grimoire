.PHONY: install dev-backend dev-frontend dev help

# Load environment variables from GitHub
LOAD_ENV = eval $$(ENV_TYPE=development node scripts/sync-env-from-github.js)
MONGO_URI ?= $(shell echo "Add MONGO_URI manually")

help:
	@echo "Available commands:"
	@echo "  make install       - Install frontend and backend dependencies"
	@echo "  make dev-backend   - Start backend with env vars from GitHub"
	@echo "  make dev-frontend  - Start frontend with env vars from GitHub"
	@echo "  make dev           - Show instructions for running both"

install:
	npm install
	cd backend && npm install

dev-backend:
	@if [ -z "$$MONGO_URI" ]; then \
		echo "❌ Error: MONGO_URI not set"; \
		echo "Usage: export MONGO_URI=\"your-connection-string\" && make dev-backend"; \
		exit 1; \
	fi
	$(LOAD_ENV) && \
	cd backend && npm run dev

dev-frontend:
	$(LOAD_ENV) && npm start

dev:
	@echo "==================== Development Setup ===================="
	@echo ""
	@echo "Terminal 1 - Start Backend:"
	@echo "  make dev-backend"
	@echo ""
	@echo "Terminal 2 - Start Frontend:"
	@echo "  make dev-frontend"
	@echo ""
	@echo "============================================================"
	@echo "Note: Replace MONGO_URI in Makefile or export it manually"
	@echo "============================================================"
