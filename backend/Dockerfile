FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    GROUPSUM_DATABASE_PATH=/data/groupsum-catalog.sqlite3 \
    PIP_ROOT_USER_ACTION=ignore
COPY backend /app/backend
COPY catalog /app/catalog
COPY public/insights-index.json /app/public/insights-index.json
RUN python -m pip install --no-cache-dir --require-hashes -r /app/backend/requirements.lock.txt \
    && python -m pip install --no-cache-dir --no-deps /app/backend
EXPOSE 8000
CMD ["python", "-m", "groupsum_catalog_api.entrypoint"]
