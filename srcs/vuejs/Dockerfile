# Latest stable version of alpine linux image as of 15/04/2024
FROM alpine:3.19.1

ARG APP_DIR='/app' \
    PORT

ENV PORT=${PORT}

# Install dependencies
RUN apk update && \
    apk add --no-cache --virtual .build-deps \
        nodejs \
        npm && \
    npm install -g pnpm && \
    rm -f /var/cache/apk/*

# Create and Set the working directory in the container
WORKDIR ${APP_DIR}

# Copy package files, and install dependencies using pnpm
COPY ./app/package*.json ./app/pnpm-lock.yaml ./
RUN pnpm install

# Copy the rest of the application code into the working directory
COPY ./app/ .

# Build the application (assumes there's a build script defined in package.json)
RUN pnpm run build

# Create non-root USER to run the application
RUN addgroup -S vuejs && \
    adduser -S vuejs -G vuejs && \
    chown -R vuejs:vuejs ${APP_DIR} && \
	chmod 700 ${APP_DIR}

# Set USER
USER vuejs

# Expose Vue default port
EXPOSE ${PORT}

CMD ["pnpm", "run", "dev"]
#CMD ["pnpm", "run", "build"]
