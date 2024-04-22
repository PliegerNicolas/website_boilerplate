# Latest stable version of alpine linux image as of 15/04/2024
FROM alpine:3.19.1

# Set docker-compose build arguments
ARG PORT \
	POSTGRES_DB \
	POSTGRES_USER \
	POSTGRES_PASSWORD

# Set local build arguments
ARG	PGDATA='/var/lib/postgresql/data' \
	PGRUN='/run/postgresql' \
	PGSCRIPTS='/var/lib/postgresql/scripts'

# Add PGDATA to env variables independently of docker-compose
ENV PGDATA=${PGDATA}

# Install dependencies
RUN apk update && \
    apk add --no-cache --virtual .build-deps \
        postgresql \
        postgresql-contrib && \
    rm -f /var/cache/apk/*

# Set permissions on data and socket directories
RUN mkdir -p ${PGDATA} ${PGRUN} ${PGSCRIPTS} && \
	chown -R postgres:postgres ${PGDATA} ${PGRUN} ${PGSCRIPTS} && \
	chmod 700 ${PGDATA} ${PGRUN} ${PGSCRIPTS}

# Set user
USER postgres

# Initializing PostgreSQL database cluster if needed
RUN if [ -z "$(ls -A $PGDATA)" ]; then \
		initdb -D $PGDATA -E UTF8 --locale=en_US.utf8 || exit 1; \
	fi

# Transfer local configuration files to container
COPY ./conf/pg_hba.conf ./conf/postgresql.conf.template ${PGDATA}/
COPY ./scripts/generate_postgresql.conf.sh ${PGSCRIPTS}/

# Execute script to generate postgresql.conf
RUN sh ${PGSCRIPTS}/generate_postgresql.conf.sh && rm -rf ${PGSCRIPTS}

# Setup $POSTGRES_DB
RUN pg_ctl -w start && \
		if [ -z "$( psql -p $PORT -XtAc "SELECT 1 FROM pg_database WHERE datname='$POSTGRES_DB'" )" ]; then \
			psql -p $PORT -c "CREATE DATABASE $POSTGRES_DB"; \
		fi && \
		if [ -z "$(psql -p $PORT -XtAc "SELECT 1 FROM pg_user WHERE usename!='postgres'" )" ]; then \
			psql -p $PORT -c "CREATE USER $POSTGRES_USER WITH ENCRYPTED PASSWORD '$POSTGRES_PASSWORD';"; \
			psql -p $PORT -c "GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;"; \
		fi && \
    pg_ctl -w stop -m fast

# Expose given port
EXPOSE ${PORT}

CMD ["postgres"]