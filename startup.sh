#!/bin/bash

# Navigate to the app directory
cd /home/site/wwwroot

# Run database migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Start Gunicorn
gunicorn config.wsgi:application --bind=0.0.0.0:8000 --workers=2 --timeout=600
