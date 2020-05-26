#!/bin/bash
#parameters: subdomain title {webmonetization url}
#replace the title and web monetization url in the directory
sed -i 's/TITLE/'"$2"'/g' /var/www/html/$1/index.html
sed -i 's/MONETIZATION/'"$3"'/g' /var/www/html/$1/index.html