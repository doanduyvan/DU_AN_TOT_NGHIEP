# Sử dụng Apache HTTPD
FROM httpd:2.4

# Copy file build từ thư mục 'dist' vào thư mục gốc của Apache
COPY dist/ /usr/local/apache2/htdocs/

# Copy cấu hình Apache để hỗ trợ React Router
COPY ./conf/httpd.conf /usr/local/apache2/conf/httpd.conf

COPY ./conf/.htaccess /usr/local/apache2/htdocs/.htaccess

# Kiểm tra và đảm bảo MPM được load trong httpd.conf
RUN grep -q "LoadModule mpm_" /usr/local/apache2/conf/httpd.conf || \
    echo "LoadModule mpm_prefork_module modules/mpm_prefork_module.so" >> /usr/local/apache2/conf/httpd.conf

# Expose cổng 80 để chạy server
EXPOSE 80

# Chạy Apache HTTPD
CMD ["httpd", "-D", "FOREGROUND"]
