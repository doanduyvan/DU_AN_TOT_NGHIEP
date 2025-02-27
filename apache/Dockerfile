# Sử dụng image Apache chính thức
FROM httpd:alpine

# Copy file cấu hình Virtual Host
COPY ./conf/httpd.conf /usr/local/apache2/conf/httpd.conf

# Kích hoạt module MPM
RUN sed -i 's/^LoadModule mpm_/#LoadModule mpm_/g' /usr/local/apache2/conf/httpd.conf \
    && sed -i 's/^#LoadModule mpm_prefork_module/LoadModule mpm_prefork_module/g' /usr/local/apache2/conf/httpd.conf


# Mở cổng 80 để truy cập
EXPOSE 80

# Khởi động Apache
CMD ["httpd", "-D", "FOREGROUND"]
