#!/bin/bash

set -e
source ~/.profile

readonly NAME={{ site_name }}
readonly DOCROOT="/var/www/$NAME/api"

cd $DOCROOT

if ! [ -d venv ]; then
    python{{ dependency_versions[env]["python"] }} -m venv venv
fi

source venv/bin/activate
pip3 install -r requirements.txt
export MYSQL_HOST=localhost
export MYSQL_USER={{ sql["user"] }}
export MYSQL_PASSWORD={{ sql["password"] }}
export MYSQL_DB={{ sql["db"] }}
export HYPERCORN_CERTFILE="/etc/letsencrypt/live/{{ site_host }}/fullchain.pem"
export HYPERCORN_KEYFILE="/etc/letsencrypt/live/{{ site_host }}/privkey.pem"
export PORT="{{ api_port }}"
export IMAGE_URL="https://{{ cdn_host }}/images"
export IMAGE_FOLDER="/var/www/{{ site_name }}/cdn/images"
python3 main.py