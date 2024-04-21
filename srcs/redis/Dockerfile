# Latest stable version of alpine linux image as of 15/04/2024
FROM alpine:3.19.1

ARG REDIS_PATH='/etc/redis' \
    REDIS_SCRIPTS='/etc/redis/scripts/' \
    PORT

ENV PORT=${PORT}

# Install dependencies
RUN apk update && \
    apk add --no-cache --virtual .build-deps \
        redis && \
    rm -f /var/cache/apk/*

WORKDIR ${REDIS_PATH}

# Transfer local configuration files to container
COPY ./conf/redis.conf.template ./
COPY ./scripts/generate_redis.conf.sh ${REDIS_SCRIPTS}/

# Execute script to generate postgresql.conf
RUN sh ${REDIS_SCRIPTS}/generate_redis.conf.sh && rm -rf ${REDIS_SCRIPTS}

# Set USER
USER redis

# Expose port
EXPOSE ${PORT}

CMD ["redis-server", "redis.conf"]