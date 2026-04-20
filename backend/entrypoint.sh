#!/bin/sh
set -e

echo "==> Collecting static files..."
python manage.py collectstatic --noinput

echo "==> Running database migrations..."
python manage.py migrate --noinput

echo "==> Creating superuser (if ADMIN_EMAIL is set and user doesn't exist)..."
python manage.py shell -c "
import os
from django.contrib.auth import get_user_model
User = get_user_model()
email    = os.environ.get('ADMIN_EMAIL', '')
password = os.environ.get('ADMIN_PASSWORD', '')
if email and password and not User.objects.filter(email=email).exists():
    User.objects.create_superuser(email=email, password=password, first_name='Admin', last_name='AFS')
    print(f'Superuser {email} created.')
"

echo "==> Starting Gunicorn..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
