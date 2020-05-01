# Teaching-HEIGVD-RES-2020-Labo-HTTPInfra

Students:

* Bonzon Ludovic
* Kayoumi Doran

All of our work can be found on [this repo](https://github.com/bonzonlu/Teaching-HEIGVD-RES-2020-Labo-HTTPInfra/tree/fb-apache-static)

## Configuration used for this lab

We've used two different work environments:

![](doc/manjaro.png)



![](doc/apple_master_race.jpg)

## Step 1 - Static HTTP server with apache httpd

In this first set we will setup a static Apache HTTP server with Docker.

### Dockerfile

```dockerfile
FROM php:7.4.5-apache
COPY content/ /var/www/html/
```

We've based our docker image on the official [php](https://hub.docker.com/_/php) image with the **Apache** variant version **7.4.5**. We could have directly used Apache [official](https://hub.docker.com/_/httpd) image, but since we'll be needing php in further steps, we've decided to use php since it comes with an Apache server already configured.

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

### Demo

![](doc/demo_step1.jpg)

Here we can see that we built and run the Docker container using the scripts, then showed the running containers. In the background we can see the webpage up and running on `localhost:9090`.



## Step 2: Dynamic HTTP server with express.js

In this set we will write an HTTP app in Node.js capable of returning JSON payload on GET requests and also learn to use Postman to test HTTP apps. All of that in the same repo.

### Dockerfile

```dockerfile
FROM node:12.16.3
COPY src/ /opt/app
CMD ["node", "/opt/app/index.js"]
```

We've based our docker image on the official [**NodeJS**](https://hub.docker.com/_/node) image in version **12.16.3**.

Then we've  configured our image to copy the contents of `src/` (our cool app) to `/opt/app` on the server.

The last command will allow the `node /opt/app/index.js` command to be executed every time we run a container based on this image.

### Usage

It is good practice when we create a new Node.js app to do a `npm init`. The command ask for the following: an app name, a version, a description, an entry point, and a few other infos. which we leave as defaults. It will then create a `package.json` file.

The main script will be located in the `index.js` file. Inside this file we create a simple app which uses the [chance.js](https://chancejs.com/) module to display a welcome message followed by the name of a random person.

```javascript
//index.js

```

Then we build the image using `docker build -t res/express_students .` and we can run it as many times as we want using the `docker run res/express_students` command. We can see the welcome message. Every instance of the Docker container executes the script once, then the container is stopped.

We can also see the contents of the container by running it in interactive mode : `docker run -it res/express_students /bin/bash`. If we display the content of the `/opt/app` folder, we can see the following files :

```
index.js
node_modules
package.json
```

### Using express.js framework

To go a little further, instead of writing plumber code from scratch, we can use a web framework such as [**express.js**](https://expressjs.com/). The installation is fairly simple using the following command `npm i express --save`. 

For now we will modify our app to be able to listen on a given port, and when a client connects return a list of variable length containing random students with their name and birthdate. 

```javascript
//index.js


```

### Using Postman to submit queries

