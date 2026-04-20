#!/bin/bash
# AWS EC2 deployment script — run from project root on the server.
# Usage: bash scripts/deploy.sh
set -e

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
WEB_ROOT="/var/www/cloths-by-asf"

echo "======================================================"
echo "  Deploying Cloths by ASF  →  AWS EC2"
echo "======================================================"

echo ""
echo "==> [1/5] Pulling latest code from main..."
cd "$APP_DIR"
git pull origin main

echo ""
echo "==> [2/5] Building React frontend..."
cd "$APP_DIR/frontend"
npm ci --silent
npm run build
sudo cp -r dist/. "$WEB_ROOT/dist/"
echo "    Frontend copied to $WEB_ROOT/dist/"

echo ""
echo "==> [3/5] Building & starting Docker containers..."
cd "$APP_DIR"
docker compose build --no-cache
docker compose up -d

echo ""
echo "==> [4/5] Waiting for backend to be ready..."
for i in $(seq 1 15); do
    if docker compose exec -T backend python manage.py check --deploy > /dev/null 2>&1; then
        echo "    Backend ready."
        break
    fi
    echo "    Waiting... ($i/15)"
    sleep 3
done

echo ""
echo "==> [5/5] Reloading Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "======================================================"
echo "  Deployment complete!"
PUBLIC_IP=$(curl -s --max-time 3 http://checkip.amazonaws.com 2>/dev/null || echo "YOUR_EC2_IP")
echo "  Site:  http://$PUBLIC_IP"
echo "  Admin: http://$PUBLIC_IP/admin/"
echo "  API:   http://$PUBLIC_IP/api/v1/"
echo "======================================================"

echo ""
echo "--- Docker container status ---"
docker compose ps
