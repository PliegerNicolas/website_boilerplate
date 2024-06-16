# Latest stable version of alpine linux image as of 16/06/2024
FROM alpine:3.20.0

# Set docker-compose build arguments
ARG PORT

# Set local build arguments
ARG APP_DIR='/app'

# Install dependencies
RUN apk update && \
    apk add --no-cache --virtual .build-deps \
        nodejs redis \
        npm \
        gcc make libc-dev linux-headers \
        python3 && \
    npm install -g pnpm && \
    rm -f /var/cache/apk/*

# Create and Set the working directory in the container
WORKDIR ${APP_DIR}

# Create non-root USER to run the application
RUN addgroup -S nestjs && \
    adduser -S nestjs -G nestjs && \
    chown -R nestjs:nestjs ${APP_DIR} && \
	chmod 700 ${APP_DIR}

# Set USER
USER nestjs

# Copy package files, and install dependencies using pnpm
COPY ./app/package*.json ./app/pnpm-lock.yaml ./
RUN pnpm install

# Copy the rest of the application code into the working directory
COPY ./app/ .

# Build the application (assumes there's a build script defined in package.json)
RUN pnpm run build

# Expose NestJs port
EXPOSE ${PORT}

CMD ["pnpm", "run", "start:dev"]
