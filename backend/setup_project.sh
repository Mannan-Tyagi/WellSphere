#!/bin/bash

# Create the Django project
django-admin startproject wellsphere .

# Create the apps
django-admin startapp users
django-admin startapp appointments
django-admin startapp medical_records
django-admin startapp messaging
django-admin startapp analytics
django-admin startapp billing

# Create directories for project configuration
mkdir -p wellsphere/settings
mkdir -p wellsphere/utils

# Create necessary files
touch wellsphere/settings/__init__.py
touch wellsphere/settings/base.py
touch wellsphere/settings/development.py
touch wellsphere/settings/production.py
touch wellsphere/utils/__init__.py
touch .env
touch .env.example
