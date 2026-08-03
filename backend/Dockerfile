FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    GROUPSUM_DATABASE_URL=postgresql+psycopg://groupsum:groupsum@groupsum-postgres:5432/groupsum \
    GROUPSUM_ANALYTICS_PATH=/analytics/groupsum-metrics.duckdb \
    PIP_ROOT_USER_ACTION=ignore
COPY backend/requirements.lock.txt /app/backend/requirements.lock.txt
RUN python -m pip install --no-cache-dir --require-hashes -r /app/backend/requirements.lock.txt
COPY backend /app/backend
RUN python -m pip install --no-cache-dir --no-deps /app/backend
COPY catalog /app/catalog
COPY public/insights-index.json /app/public/insights-index.json
EXPOSE 8000
CMD ["python", "-m", "groupsum_catalog_api.entrypoint"]
