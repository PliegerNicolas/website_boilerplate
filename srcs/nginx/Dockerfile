# Latest stable version of alpine linux image as of 16/06/2024
FROM alpine:3.20.0

# Set docker-compose build arguments
ARG DOMAIN_NAME \
    FRONTEND_PORT \
    BACKEND_PORT

# Set local build arguments
ARG NGINX_VERSION='1.24.0' \
    NGINX_SCRIPTS='/var/nginx/scripts'

# Install dependencies
RUN apk update && \
    apk add --no-cache --virtual .build-deps \
        gcc make libc-dev linux-headers \
        pcre-dev \
        zlib-dev \
        openssl-dev && \
    rm -f /var/cache/apk/*

# Install and compile the nginx binary (with optional modules)
RUN wget "http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz" || { \
        echo "Failed to download nginx-${NGINX_VERSION}"; \
        exit 1; \
    }; \
    tar -zxvf "nginx-${NGINX_VERSION}.tar.gz" && \
    rm "nginx-${NGINX_VERSION}.tar.gz" && \
    cd "nginx-${NGINX_VERSION}" && \
	    ./configure \
            --prefix=/usr/local/nginx \
            --sbin-path=/usr/sbin/nginx \
            --lock-path=/var/lock/nginx.lock \
            --pid-path=/var/run/nginx.pid \
            --conf-path=/etc/nginx/nginx.conf \
            --http-log-path=/var/log/nginx/access.log \
            --error-log-path=/var/log/nginx/error.log \
            \
            --with-pcre \
            --with-threads \
            --with-http_realip_module \
            --with-http_gzip_static_module \
            --with-http_stub_status_module \
            --with-stream \
            --with-stream_ssl_module \
            --with-http_ssl_module \
            --with-mail \
            --with-mail_ssl_module && \
	    make && make install && \
    cd .. && \
    rm -r "nginx-${NGINX_VERSION}"

# Transfer local configuration files to container
COPY ./conf/nginx.conf.template /etc/nginx/
COPY ./conf/ssl_certificates /etc/nginx/ssl_certificates/
COPY ./scripts/generate_nginx.conf.sh ${NGINX_SCRIPTS}/

# Set execution permissions on needed configuration files
RUN sh ${NGINX_SCRIPTS}/generate_nginx.conf.sh && rm -rf ${NGINX_SCRIPTS}

# Expose default HTTP & HTTPS ports
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
