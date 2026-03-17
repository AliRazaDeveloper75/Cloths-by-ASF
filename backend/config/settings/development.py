from .base import *

DEBUG = True

# Dev: show emails in console
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Looser CORS for local dev
CORS_ALLOW_ALL_ORIGINS = True

# DRF browsable API in dev
REST_FRAMEWORK = {
    **REST_FRAMEWORK,
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
}

INSTALLED_APPS += ['django_extensions']
