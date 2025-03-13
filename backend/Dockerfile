FROM php:8.2-apache

# Cài đặt các extension cần thiết
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql

# Cài đặt Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Cấu hình Apache để hỗ trợ .htaccess
RUN a2enmod rewrite

# Cấu hình thư mục làm việc
WORKDIR /var/www/html

#copy file config apache

COPY ./apache-conf/000-default.conf /etc/apache2/sites-available/000-default.conf

# Copy mã nguồn Laravel vào container
COPY . .

# Thiết lập quyền
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Mở cổng 80
EXPOSE 80

# Chạy Apache
CMD ["apache2-foreground"]

