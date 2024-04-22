# Latest stable version of alpine linux image as of 15/04/2024
FROM alpine:3.19.1

# Set docker-compose build arguments
ARG PORT \
    REDIS_USER \
    REDIS_PASSWORD

# Set local build arguments
ARG REDIS_PATH='/etc/redis' \
    REDIS_SCRIPTS='/etc/redis/scripts'

# Install dependencies
RUN apk update && \
    apk add --no-cache --virtual .build-deps \
        redis && \
    rm -f /var/cache/apk/*

WORKDIR ${REDIS_PATH}

# Transfer local configuration files to container
COPY ./conf/redis.conf.template ./conf/users.acl.template ./
COPY ./scripts/generate_redis.conf.sh ./scripts/generate_users.acl.sh ${REDIS_SCRIPTS}/

# Execute script to generate postgresql.conf
RUN sh ${REDIS_SCRIPTS}/generate_redis.conf.sh && \
    sh ${REDIS_SCRIPTS}/generate_users.acl.sh && \
    rm -rf ${REDIS_SCRIPTS}

# Set USER
USER redis

# Expose port
EXPOSE ${PORT}

CMD ["redis-server", "redis.conf"]