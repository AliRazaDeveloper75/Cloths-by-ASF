#!/usr/bin/env bash
# Render build script for Django backend
set -e

echo "==> Installing Python dependencies..."
pip install -r requirements.txt

echo "==> Collecting static files..."
python manage.py collectstatic --no-input

echo "==> Running database migrations..."
python manage.py migrate users --no-input
python manage.py migrate --no-input

echo "==> Build complete."
