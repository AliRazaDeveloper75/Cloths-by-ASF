#!/usr/bin/env bash
# Render build script for Django backend
set -e

echo "==> Installing Python dependencies..."
pip install \
  Django \
  djangorestframework \
  djangorestframework-simplejwt \
  psycopg2-binary \
  dj-database-url \
  django-cors-headers \
  python-decouple \
  Pillow \
  django-filter \
  django-anymail \
  django-storages \
  boto3 \
  drf-yasg \
  whitenoise \
  gunicorn \
  django-extensions

echo "==> Collecting static files..."
python manage.py collectstatic --no-input

echo "==> Running database migrations..."
python manage.py migrate users --no-input
python manage.py migrate --no-input

echo "==> Build complete."
