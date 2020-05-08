FROM php:7.4.5-apache

# copy our configurations to the server
COPY conf/ /etc/apache2

# enable the proxy modules & our sites
RUN a2enmod proxy proxy_http
RUN a2ensite 000-* 001-*
