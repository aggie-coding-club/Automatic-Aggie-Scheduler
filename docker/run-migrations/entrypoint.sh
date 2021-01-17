#!/bin/sh
export SETTINGS_MODE=schedule
python3 manage.py migrate --settings=autoscheduler.settings.docker
