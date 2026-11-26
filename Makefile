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
	$(LOAD_ENV) && \
	export MONGO_URI="mongodb+srv://user:password@cluster.mongodb.net/" && \
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
