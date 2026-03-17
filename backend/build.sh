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
  django-extensions \
  cloudinary \
  django-cloudinary-storage

echo "==> Collecting static files..."
python manage.py collectstatic --no-input

echo "==> Running database migrations..."
python manage.py migrate users --no-input
python manage.py migrate --no-input

echo "==> Creating admin superuser (if not exists)..."
python manage.py shell -c "
import os
from django.contrib.auth import get_user_model
User = get_user_model()
email    = os.environ.get('ADMIN_EMAIL', '')
password = os.environ.get('ADMIN_PASSWORD', '')
if email and password:
    if not User.objects.filter(email=email).exists():
        User.objects.create_superuser(
            email=email,
            password=password,
            first_name='Admin',
            last_name='AFS',
        )
        print(f'Superuser {email} created successfully.')
    else:
        print(f'Superuser {email} already exists — skipped.')
else:
    print('ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping superuser creation.')
"

echo "==> Build complete."
