#!/bin/bash
#parameters: subdomain
#create the directory
mkdir /var/www/html/$1

#copy template files into the directory
cp /var/nodejs/server/templates/general/* /var/www/html/$1./*

#create and configure nginx configuration file
touch /etc/nginx/sites-available/$1.incinicreator.io

printf 'server {' \
    'listen 80;' \
    'listen [::]:80;' \
    'root /var/www/html/$1;' \
    'index index.html index.htm index.nginx-debian.html;' \
    '\n' \
    'server_name $1.incinicreator.io;' \
    '\n' \
    'location / {' \
        'try_files $uri $uri/ =404;' \
    '}' \
'}' > /etc/nginx/sites-available/$1.incinicreator.io

ln -s /etc/nginx/sites-avialble/$1.incinicreator.io /etc/nginx/sites-enabled/$1.incinicreator.io