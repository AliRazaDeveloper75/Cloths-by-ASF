#!/bin/bash
# AWS EC2 deployment script (venv-based, no Docker)
# Usage: bash scripts/deploy.sh
set -e

APP_DIR="/home/ubuntu/Cloths-by-ASF"
BACKEND="$APP_DIR/backend"
FRONTEND="$APP_DIR/frontend"
VENV="$BACKEND/venv/bin"
WEB_ROOT="/var/www/cloths-by-asf"

echo "======================================================"
echo "  Deploying Cloths by ASF  →  AWS EC2"
echo "======================================================"

# ── 1. Pull latest code ────────────────────────────────────
echo ""
echo "==> [1/6] Pulling latest code..."
cd "$APP_DIR"
git pull origin main

# ── 2. Python dependencies ────────────────────────────────
echo ""
echo "==> [2/6] Installing Python dependencies..."
"$VENV/pip" install -r "$BACKEND/requirements.txt" -q

# ── 3. Django: migrate + collectstatic ───────────────────
echo ""
echo "==> [3/6] Running migrations & collecting static files..."
cd "$BACKEND"
DJANGO_SETTINGS_MODULE=config.settings.production \
    "$VENV/python" manage.py migrate --noinput
DJANGO_SETTINGS_MODULE=config.settings.production \
    "$VENV/python" manage.py collectstatic --noinput

sudo mkdir -p "$WEB_ROOT/staticfiles"
sudo cp -r "$BACKEND/staticfiles/." "$WEB_ROOT/staticfiles/"

# ── 4. Build React frontend ───────────────────────────────
echo ""
echo "==> [4/6] Building React frontend..."
cd "$FRONTEND"
# Increase Node memory limit to avoid OOM crash on t3.micro
export NODE_OPTIONS="--max-old-space-size=512"
npm ci --prefer-offline --silent 2>/dev/null || npm install --silent
npm run build

sudo mkdir -p "$WEB_ROOT/dist"
sudo cp -r dist/. "$WEB_ROOT/dist/"

# ── 5. Fix permissions ────────────────────────────────────
echo ""
echo "==> [5/6] Fixing web root permissions..."
sudo chown -R ubuntu:www-data "$WEB_ROOT"
sudo chmod -R 755 "$WEB_ROOT"

# ── 6. Restart services ───────────────────────────────────
echo ""
echo "==> [6/6] Restarting Gunicorn & reloading Nginx..."
sudo systemctl restart gunicorn-cloths
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "======================================================"
echo "  Deployment complete!"
echo "  Site:        https://afscloths.com"
echo "  Admin:       https://afscloths.com/admin/login"
echo "  Django Admin:https://afscloths.com/django-admin/"
echo "  API:         https://afscloths.com/api/v1/"
echo "======================================================"
