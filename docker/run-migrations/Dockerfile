# Basically identical to the scrape-courses Dockerfile
FROM python:3.7-slim
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /app

COPY autoscheduler /app
RUN pip install -r requirements.txt

COPY docker/run-migrations/entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
