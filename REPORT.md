# Teaching-HEIGVD-RES-2020-Labo-HTTPInfra

Students:

* Bonzon Ludovic
* Kayoumi Doran

All of our work can be found on [this repo](https://github.com/bonzonlu/Teaching-HEIGVD-RES-2020-Labo-HTTPInfra/tree/fb-apache-static)

## Step 1 - Static HTTP server with apache httpd

In this first set we will setup a static Apache HTTP server with Docker.

### Dockerfile

```dockerfile
FROM php:7.4.5-apache
COPY content/ /var/www/html/
```

We've based our docker image on the official [php](https://hub.docker.com/_/php) image with the **Apache** variant version **7.4.5**. We could have directly used Apache [official](https://hub.docker.com/_/httpd) image, but since we'll be needing php in further steps, we've decided to use php since it comes with an Apache server.

Then we've  configured our image to copy the contents of `content/` (our cool website) to `/var/www/html` on the server.

### Apache configuration

All of Apache configuration files can be found in `/etc/apache2`:

```
apache2.conf
conf-available
conf-enabled
envvars
magic
mods-enabled
mods-available
ports.conf
sites-available
sites-enabled
```

- **apache2.conf**: This is the main configuration file  for the server. 
- **ports.conf**: This file is used to specify the ports that virtual hosts should listen on. 
- **conf.d/**: This directory is used for controlling  specific aspects of the Apache configuration. 
- **sites-available/**: This directory contains all of  the virtual host files that define different web sites.  These will  establish which content gets served for which requests.  
- **sites-enabled/**: This directory establishes which  virtual host definitions are actually being used.  This directory consists of symbolic links to files defined in the "sites-available" directory.
- **mods-[enabled,available]/**: These directories are  similar in function to the sites directories, but they define modules  that can be optionally loaded instead.

In the **sites-available** folder we can find the default Virtual host configuration.

```
<VirtualHost *:80>
	# The ServerName directive sets the request scheme, hostname and port that
	# the server uses to identify itself. This is used when creating
	# redirection URLs. In the context of virtual hosts, the ServerName
	# specifies what hostname must appear in the request's Host: header to
	# match this virtual host. For the default virtual host (this file) this
	# value is not decisive as it is used as a last resort host regardless.
	# However, you must set it for any further virtual host explicitly.
	#ServerName www.example.com

	ServerAdmin webmaster@localhost
	DocumentRoot /var/www/html

	# Available loglevels: trace8, ..., trace1, debug, info, notice, warn,
	# error, crit, alert, emerg.
	# It is also possible to configure the loglevel for particular
	# modules, e.g.
	#LogLevel info ssl:warn

	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined

	# For most configuration files from conf-available/, which are
	# enabled or disabled at a global level, it is possible to
	# include a line for only one particular virtual host. For example the
	# following line enables the CGI configuration for this host only
	# after it has been globally disabled with "a2disconf".
	#Include conf-available/serve-cgi-bin.conf
</VirtualHost>
```

Normally when a new site is added to the server you should create a new configuration file and then create a symbolic link in **sites-available** so that the website will be served by the web server. 

Since our server will only host one website, we've decided not to create a custom configuration file and just copy our website in the **DocumentRoot** set in the default config i.e. `/var/www/html`.

### Usage

To build the image you can run the `build-image.sh` script. Then to run the container, execute `run-container.sh`.

