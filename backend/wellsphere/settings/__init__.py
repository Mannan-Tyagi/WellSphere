"""
Settings package initialization for WellSphere.
Determines which settings file to use based on the environment.
"""

import os

# Set the default settings module
DJANGO_SETTINGS_MODULE = os.environ.get('DJANGO_SETTINGS_MODULE', 'wellsphere.settings.development')

# Import the appropriate settings based on the environment
if DJANGO_SETTINGS_MODULE == 'wellsphere.settings.production':
    from .production import *
else:
    from .development import *
