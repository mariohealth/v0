.PHONY: all prereqs init link env frontend backend rewrites validate deploy help

# Default target - run all phases in order
all: prereqs init link env frontend backend rewrites validate deploy

# Phase 0: Check prerequisites
prereqs:
	@bash tools/00_prereqs.sh

# Phase 1: Initialize Firebase project
init:
	@bash tools/01_firebase_init.sh

# Phase 2: Link Cloud Run service
link:
	@bash tools/02_link_cloud_run.sh

# Phase 3: Set up environment files
env:
	@bash tools/03_env_setup.sh

# Phase 4: Migrate frontend to Firebase Auth
frontend:
	@bash tools/04_frontend_auth_migration.sh

# Phase 5: Backend Firebase Admin SDK (ADC) + CORS + secure routes
backend:
	@bash tools/05_backend_adc_and_cors.sh

# Phase 6: Configure Firebase Hosting rewrites
rewrites:
	@bash tools/06_rewrites_and_hosting.sh

# Phase 7: Validate locally
validate:
	@bash tools/07_validate_local.sh

# Phase 8: Deploy to Firebase Hosting
deploy:
	@bash tools/08_deploy.sh

# Help target
help:
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "🔥 Firebase Deployment Makefile"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "Available targets:"
	@echo "  make all        - Run all phases in order (recommended for first-time setup)"
	@echo "  make prereqs    - Check prerequisites (Node, npm, Firebase CLI, gcloud CLI)"
	@echo "  make init       - Initialize Firebase project (.firebaserc, firebase.json)"
	@echo "  make link       - Link Cloud Run service (verify service exists)"
	@echo "  make env        - Set up environment files (.env.firebase, frontend .env files)"
	@echo "  make frontend   - Migrate frontend to Firebase Auth"
	@echo "  make backend    - Set up backend Firebase Admin SDK (ADC) + CORS"
	@echo "  make rewrites   - Configure Firebase Hosting rewrites to Cloud Run"
	@echo "  make validate   - Validate local setup (instructions printed)"
	@echo "  make deploy     - Deploy to Firebase Hosting"
	@echo "  make help       - Show this help message"
	@echo ""
	@echo "Quick start:"
	@echo "  1. Create .env.firebase with your project variables"
	@echo "  2. Run: make all"
	@echo ""
	@echo "For step-by-step setup:"
	@echo "  make prereqs && make init && make link && make env"
	@echo "  make frontend && make backend && make rewrites"
	@echo "  make validate && make deploy"
	@echo ""
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

