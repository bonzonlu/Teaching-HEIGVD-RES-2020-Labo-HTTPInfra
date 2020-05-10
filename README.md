

# Teaching-HEIGVD-RES-2020-Labo-HTTPInfra

> Students: Bonzon Ludovic & Kayoumi Doran
>
> Date: 01.05.2020

All of our work can be found on [this repo](https://github.com/bonzonlu/Teaching-HEIGVD-RES-2020-Labo-HTTPInfra/tree/fb-apache-static)

## Configuration used for this lab

We've used two different work environments:

|                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| <img src="doc/btw_i_use_arch.png" alt="drawing" width="520"/> | <img src="doc/apple_master_race.jpg" alt="drawing" width="500"/> |

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

### Setup

To start using our website, you'll need to run the following:

```bash
docker build --tag res/apache_php .
docker run -d --rm -p 9090:80 --name static-http res/apache_php
```

You'll then be able to access the website on `localhost:9090`.

### Usage

![](doc/demo_step1.jpg)

Here we can see that we built and run the Docker container using the scripts, then showed the running containers. In the background we can see the webpage up and running on `localhost:9090`.



## Step 2: Dynamic HTTP server with express.js

In this set we will write an HTTP app in Node.js capable of returning JSON payload on GET requests and also learn to use Postman to test HTTP apps. All of that in the same repo.

### Dockerfile

```dockerfile
FROM node:12.16.3

# create the directory for our cool app
WORKDIR /opt/app

# install the dependencies for our app
## first copy `package.json` and `package-lock.json`
COPY src/package*.json ./
## then we can install the dependencies w/ npm
RUN npm i

# bundle the app
COPY src .

# run the app
CMD ["node", "index.js"]

```

We've based our docker image on the official [**NodeJS**](https://hub.docker.com/_/node) image in version **12.16.3**.

The first thing we did is to create our server side working directory in `/opt/app` . Then we installed the dependencies of our (cool) app by copying the `package.json` and `package-lock.json` to the server and then running `npm i` (this is a shortcut for `npm install`, since we're lazy, we've decided to use it..don't judge!).

Once the dependencies installed, we can copy our app to the server.

And last but not least, we can run our app (which is very cool) using `node index.js`.

Note: We've added a `.dockerignore` file to avoid copying the `node_modules` to the server. This is to prevent any issues if we've installed local modules that aren't needed for the app. This isn't the case here..but better be safe than sorry.

[Source](https://nodejs.org/fr/docs/guides/nodejs-docker-webapp/)

### Setup

To start using our app (or improve it), you'll need to run the following commands

```bash
docker build -t res/express .
docker run -d -p 9090:3000 --name dynamic-http res/express
```

You'll then be able to access the app on `localhost:9090`. Pretty cool right?

>Note: If you decided to improve our application (btw thank you) you'll need to rebuild the image and create a new container (i.e. you'll have to rerun the above commands :sweat:).

### Application

For our application we've used the minimalist yet awesome framework [express.js](https://expressjs.com/) and the [Chance.js](https://chancejs.com/index.html) library.  Our app will generate random user profiles and hashtags and return them in the JSON format.

You can can generate them using the following `GET` routes:

* `/hashtag`
* `/profile`
* `/profile/:count`

> Note: `:count` is the number of profiles you wish to create.

### Usage

Here are some example of usage of our application.

#### Telnet

```bash
$ telnet localhost 9090
Trying ::1...
Connected to localhost.
Escape character is '^]'.
GET /profile HTTP/1.0

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 181
ETag: W/"b5-KZ+dCpUE8D2y8w8sSTFGI043wP0"
Date: Fri, 08 May 2020 16:35:29 GMT
Connection: close

{"name":"Franklin Fowler","gender":"Male","pet":"Hedgehogs","email":"goc@fozazuko.nc","avatar":"https://www.gravatar.com/avatar/7a408e854b2687dfcc550f9f399f149a","hashtag":"#amapi"}
Connection closed by foreign host.
```

#### Browser

![](doc/express_browser.png)

#### Postman

![](doc/express_postman.png)



## Step 3: Reverse proxy with apache (static configuration)

In this step we're going to setup an apache reverse proxy. It's purpose is to sit between out HTTP servers and  external clients, forwarding client requests to the appropriate server.

### Dockerfile

```dockerfile
FROM php:7.4.5-apache

# copy our configurations to the server
COPY conf/ /etc/apache2

# enable the proxy modules & our sites
RUN a2enmod proxy proxy_http
RUN a2ensite 000-* 001-*
```

Our Dockerfile is pretty straight forward. Same as for [step 1](#step-1---static-http-server-with-apache-httpd), we've based our docker image on the official [php](https://hub.docker.com/_/php) image with the **Apache** variant version **7.4.5**. Then we copied the virtual hosts we created for our reverse proxy. Finally, we enable the modules needed to use a proxy and our websites.

#### Virtual hosts

```
# 000-default.conf
<VirtualHost *:80>
</VirtualHost>
```

We've setup an empty default virtual to restrict the access to our servers. By doing this, if someone tries to access our services without specifying the host defined in the reverse proxy virtual host, he'll be redirected to the default one and get an error message.

```
# 001-reverse-proxy.conf
<VirtualHost *:80>
  ServerName res.summer-adventure.io

  # API
  ProxyPass "/api/" "http://172.17.0.3:3000/"
  ProxyPassReverse "/api/" "http://172.17.0.3:3000/"

  # Website
  ProxyPass "/" "http://172.17.0.2/"
  ProxyPassReverse "/" "http://172.17.0.2/"

</VirtualHost>
```

This virtual host is the one that will be used for our reverse proxy. The first thing we did is specify a `ServerName` so that our server will only accept requests with that name set in the `Host` part of the HTTP header.

Next we've configured 2 `ProxyPass`, one for the api and the second for the static website. Their purpose is to redirect the requests to the correct server. If they start by `/api/`, they'll will be redirected to the dynamic HTTP server otherwise, they'll be redirected to the static HTTP server.

> Note: There's one big issue with this configuration. It's that we've "hard coded" the IP addresses of our servers. This is a problem because we do not know what addresses docker will give to our servers. 

### Setup

As we've stated above, there could be an issue with the IP addresses since they're hardcoded :flushed:. Before running the reverse proxy, you'll need to have both HTTP servers up and running before hand. You can follow their respective setup instructions [here](#setup) and [here](#setup-1).

> Note: You don't need to do any port forwarding.

Next, you'll need to check the IP addresses of both containers and if need be, edit the reverse proxy configuration.

```bash
docker inspect static-http | grep IPA
docker inspect dynamic-http | grep IPA
```

If you have a big sad moment and the IP addresses aren't the same as the ones we've configured, you'll have to edit the reverse proxy configuration (`001-reverse-proxy.conf`) and change the IP addresses.

> Note: You'll have to copy the content of `example-reverse-proxy.conf` in `001-reverse-proxy.conf`. The files can can be found here:
> docker-images/reverse-proxy/conf/sites-available

Once you have the configuration files sorted, all that is left to do is build and run the reverse proxy. You can run the following:

```bash
docker build --tag res/reverse-proxy .
docker run -d --rm -p 8080:80 --name reverse-proxy res/reverse-proxy
```

And voila, you have the reverse proxy and both HTTP servers up and running.

If you want to be able to use the services, you'll need update your `hosts` file and add the following:

> The location of the `hosts` file depends on your system:
>
> * For UNIX based systems the file is located at `/etc/hosts`.
>
> * For Windows (why?) the is located at `C:\Windows\System32\drivers\etc\hosts`
>
> Note: You'll need to open the file with admin/root privileges

```
<ip> res.summer-adventure.io
```

The value of **<ip>** depends on your system. If you are using Linux, you can simply put `127.0.0.1`. On Windows and MacOS, you'll need to put the IP address of the Docker virtual machine.

You can now access the services at `res.summer-adventure.io`.

#### Possible improvements

As we've stated above, there could be issues with the IP addresses of our servers. To solve these issues, we've created scripts to generate the VirtualHost so you won't need to worry does pesky IP addresses and to start up the proxy server.

To start the reverse proxy you can simply run:

```bash
./start_rproxy
```

> Note: You need to be in the same directory as **start_proxy** and keep our directory structure for it to work

Same as before, you'll need to update the hosts file.



An even better solution, would be to use [docker-compose](https://docs.docker.com/compose/) to manage our containers. 

We'll start by defining our services in a `docker-compose.yml` file.

```yaml
version: "3.8"
services:
  static-http:
    build: ./docker-images/apache-php-image/
    container_name: static-http

  dynamic-http:
    build: ./docker-images/express-image/
    container_name: dynamic-http

  reverse-proxy:
    build: ./docker-images/reverse-proxy
    container_name: reverse-proxy
    ports:
      - 8080:80
```

Then in the reverse proxy virtualhost, the IP addresses can be replaced with the name of the services. Like this:

> Note: You can to copy the content of `example-compose-reverse-proxy.conf` in `001-reverse-proxy.conf`. 

```
<VirtualHost *:80>
  ServerName res.summer-adventure.io

  # API
  ProxyPass "/api/" "http://dynamic-http:3000/"
  ProxyPassReverse "/api/" "http://dynamic-http:3000/"

  # Website
  ProxyPass "/" "http://static-http/"
  ProxyPassReverse "/" "http://static-http/"
</VirtualHost>
```

To startup everything, simply run the following:

> Note: You need to be in the same directory as the `docker-compose.yml` file.

```bash
docker-compose run -d
```

And again, you'll need to update the hosts file.

### Usage

To access the dynamic server, you'll need to add `/api/` to your requests.
E.g. `res.summer-adventure.io/api/hashtags/`

#### Telnet

```bash
$ telnet localhost 8080
Trying ::1...
Connected to localhost.
Escape character is '^]'.
GET /profile HTTP/1.0

GET /api/hashtag HTTP/1.0
Host: res.summer-adventure.io

HTTP/1.1 200 OK
Date: Sat, 09 May 2020 15:17:57 GMT
Server: Apache/2.4.38 (Debian)
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 3
ETag: W/"3-eAlk7ARQltRrcHu3KndCCIaNG2M"
Connection: close

#ju
```

#### Browser

![](doc/rproxy_browser.png)



## Step 4: AJAX requests

In this step. we're going to create a javascript script to fetch `hashtags` from our api with **AJAX**.  We opted **not** to use JQuery because plain old JavaScript has evolved so much that it is now very easy to make AJAX queries and interact with the DOM. 

> Note: Nowadays, web apps are developed using frontend frameworks such as Vue.Js (:heart:), React and Angular.

```javascript
// docker-images/apache-php-image/content/js/app.js

// get the div where the hastag will be written
const target = document.getElementById('hashtag');

// fetch the first hashtag
fetchHashtag();
// update it every 3 seconds
setInterval(fetchHashtag, 3000);

/**
 * Fetch a hashtag from the api
 */
function fetchHashtag() {
  fetch("/api/hashtag/")
    // convert the response to json
    .then((res) => res.json())
    .then((data) => {
      target.innerHTML = data;
    })
    .catch(() => {
      console.log("API unreachable");
    });
}
```

Every 3 seconds, a `GET` request is made to the API to get a new hashtag and update the DOM.

![](doc/ajax.jpg)