#!/bin/bash
# One-time production setup — run ONCE on the EC2 after cloning the repo.
# Usage: bash scripts/setup-production.sh
set -e

APP_DIR="/home/ubuntu/Cloths-by-ASF"
BACKEND="$APP_DIR/backend"
WEB_ROOT="/var/www/cloths-by-asf"

echo "======================================================"
echo "  Production Setup — Cloths by ASF"
echo "======================================================"

# ── 1. System packages ────────────────────────────────────
echo ""
echo "==> [1/7] Installing system packages..."
sudo apt-get update -q
sudo apt-get install -y -q python3-pip python3-venv nodejs npm nginx curl git

# Install Node 20 (if not already)
if ! node -v | grep -q "v20"; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# ── 2. Web root directories ───────────────────────────────
echo ""
echo "==> [2/7] Creating web root directories..."
sudo mkdir -p "$WEB_ROOT/dist" "$WEB_ROOT/staticfiles" "$WEB_ROOT/media"
sudo chown -R ubuntu:www-data "$WEB_ROOT"
sudo chmod -R 755 "$WEB_ROOT"

# ── 3. Gunicorn log directory ─────────────────────────────
echo ""
echo "==> [3/7] Creating Gunicorn log directory..."
sudo mkdir -p /var/log/gunicorn
sudo chown ubuntu:ubuntu /var/log/gunicorn

# ── 4. Python virtualenv + dependencies ──────────────────
echo ""
echo "==> [4/7] Setting up Python virtualenv..."
cd "$BACKEND"
python3 -m venv venv
venv/bin/pip install --upgrade pip -q
venv/bin/pip install -r requirements.txt -q

# ── 5. Django setup ───────────────────────────────────────
echo ""
echo "==> [5/7] Running Django migrations & collectstatic..."
DJANGO_SETTINGS_MODULE=config.settings.production \
    venv/bin/python manage.py migrate --noinput
DJANGO_SETTINGS_MODULE=config.settings.production \
    venv/bin/python manage.py collectstatic --noinput
sudo cp -r staticfiles/. "$WEB_ROOT/staticfiles/"

# Create superuser from .env ADMIN_EMAIL / ADMIN_PASSWORD
DJANGO_SETTINGS_MODULE=config.settings.production \
    venv/bin/python manage.py shell -c "
import os
from django.contrib.auth import get_user_model
User = get_user_model()
email    = os.environ.get('ADMIN_EMAIL', '')
password = os.environ.get('ADMIN_PASSWORD', '')
if email and password and not User.objects.filter(email=email).exists():
    User.objects.create_superuser(email=email, password=password, first_name='Admin', last_name='AFS')
    print(f'Superuser {email} created.')
else:
    print('Superuser already exists or ADMIN_EMAIL/ADMIN_PASSWORD not set — skipped.')
"

# ── 6. Build React frontend ───────────────────────────────
echo ""
echo "==> [6/7] Building React frontend..."
cd "$APP_DIR/frontend"
npm ci --silent
npm run build
sudo cp -r dist/. "$WEB_ROOT/dist/"
sudo chown -R ubuntu:www-data "$WEB_ROOT"

# ── 7. Nginx + Gunicorn systemd ───────────────────────────
echo ""
echo "==> [7/7] Installing Nginx config & Gunicorn service..."

# Nginx
sudo cp "$APP_DIR/nginx/cloths-by-asf.conf" /etc/nginx/sites-available/cloths-by-asf
sudo ln -sf /etc/nginx/sites-available/cloths-by-asf /etc/nginx/sites-enabled/cloths-by-asf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# Gunicorn systemd service
sudo cp "$APP_DIR/systemd/gunicorn.service" /etc/systemd/system/gunicorn-cloths.service
sudo systemctl daemon-reload
sudo systemctl enable gunicorn-cloths
sudo systemctl start gunicorn-cloths
sleep 3
sudo systemctl status gunicorn-cloths --no-pager

echo ""
echo "======================================================"
echo "  Setup complete!"
echo "  Site:  http://51.20.91.11"
echo "  Admin: http://51.20.91.11/admin/"
echo "  API:   http://51.20.91.11/api/v1/"
echo "======================================================"
echo ""
echo "  Logs:"
echo "    Gunicorn: sudo journalctl -u gunicorn-cloths -f"
echo "    Nginx:    sudo tail -f /var/log/nginx/error.log"
echo ""
echo "  Auto-deploy (GitHub Actions):"
echo "    Run: bash scripts/setup-github-deploy-key.sh"
echo ""
