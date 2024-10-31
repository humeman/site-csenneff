#!/bin/bash

set -e
source ~/.profile

readonly NAME={{ site_name }}
readonly DOCROOT="/var/www/$NAME"

nvm use {{ node_version }}

cd "$DOCROOT/build"
SITE_HOST="{{ site_host }}" API_PORT="{{ api_port }}" HOST="127.0.0.1" PORT={{ svelte_port }} node index.js