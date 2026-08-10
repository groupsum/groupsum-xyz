FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    GROUPSUM_DATABASE_URL=postgresql+psycopg://groupsum:groupsum@groupsum-postgres:5432/groupsum \
    GROUPSUM_ANALYTICS_DSN=quack://groupsum-duckdb:9494 \
    PIP_ROOT_USER_ACTION=ignore
COPY pkgs/backend/requirements.lock.txt /app/pkgs/backend/requirements.lock.txt
RUN python -m pip install --no-cache-dir --require-hashes -r /app/pkgs/backend/requirements.lock.txt
COPY pkgs/backend /app/pkgs/backend
RUN python -m pip install --no-cache-dir --no-deps /app/pkgs/backend
COPY catalog /app/catalog
COPY pkgs/frontend/public/insights-index.json /app/pkgs/frontend/public/insights-index.json
EXPOSE 8000
CMD ["python", "-m", "groupsum_catalog_api.entrypoint"]
