FROM postgres:15-alpine
ENV TZ=UTC

# Copy init scripts
COPY init/ /docker-entrypoint-initdb.d/

# Ensure Postgres can read them
RUN chmod -R 755 /docker-entrypoint-initdb.d/