FROM php:8.2-fpm-alpine

# Cài đặt các dependencies
RUN apk add --no-cache \
    zip unzip git curl libpng-dev \
    && docker-php-ext-install pdo_mysql

# Cài Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Sao chép mã nguồn Laravel vào container
WORKDIR /var/www/html/
COPY . .

# Cấp quyền cho storage
RUN chmod -R 777 storage bootstrap/cache

