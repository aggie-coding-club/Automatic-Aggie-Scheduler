""" The Django settings that Docker uses for continous-integration
    This is needed as we need to create the database from scratch
"""

import os
# Says the imports are unused, but they actually since they're just constants for Django
# pylint: disable=unused-wildcard-import

# Normally not supposed to use wildcard-imports, but it's needed in this case
# pylint: disable=wildcard-import
from autoscheduler.settings.base import *
from autoscheduler.config import config

SECRET_KEY = open("/run/secrets/SECRET_DJANGO_KEY").read()

# For scrape courses on a schedule
_IS_SCHEDULE = os.getenv('SETTINGS_MODE') == 'schedule'

if _IS_SCHEDULE:
    DATABASES = {
        'default': {
            'USER': config.get_prop("user"),
            'PASSWORD': config.get_prop("password"),
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'postgres',
            'HOST': 'cloud-sql-proxy',
            'PORT': '3306',
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql_psycopg2",
            "NAME": "dbautoscheduler",
            "USER": open("/run/secrets/SECRET_POSTGRES_USER").read(),
            "PASSWORD": open("/run/secrets/SECRET_POSTGRES_PASS").read(),
            "HOST": "db",
        }
    }
