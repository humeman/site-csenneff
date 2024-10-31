#!/bin/bash

set -e
source ~/.profile

readonly NAME={{ site_name }}

readonly DOCROOT="/var/www/$NAME"
readonly TIME=$(date +%s)

readonly GIT_USER={{ git_user }}
readonly GIT_PAT={{ git_pat }}

mkdir -p "$DOCROOT/repo"
chmod 755 $DOCROOT/repo
git clone https://{{ git_user }}:{{ git_pat }}@{{ git_repo }} "$DOCROOT/repo/$TIME"
chmod -R 755 $DOCROOT/repo/$TIME

# Switch to current version
old_ver=-1
if [ -f $DOCROOT/repo/version ]; then
    old_ver=$(cat "$DOCROOT/repo/version")
fi

echo $TIME > "$DOCROOT/repo/version"

# Deploy the fallback 'err' page, which shows when SvelteKit is offline
if [ -L "$DOCROOT/err" ]; then
    rm "$DOCROOT/err"
fi
ln -s "$DOCROOT/repo/$TIME/src_err" "$DOCROOT/err"
chmod -R 755 $DOCROOT/$err

# Install node
nvm install {{ node_version }}
nvm use {{ node_version }}

# Build the server
cd "$DOCROOT/repo/$TIME/src_site"
cat << EOF > .env
PUBLIC_SITE_HOST=https://{{ site_host }}
PUBLIC_API_PORT={{ api_port }}
EOF
npm i
npx @sveltejs/kit sync
npm run build

# Replace the active version
if [ -L "$DOCROOT/build" ]; then
    rm "$DOCROOT/build"
fi
ln -s "$DOCROOT/repo/$TIME/src_site/build" "$DOCROOT/build"

if [ -L "$DOCROOT/api" ]; then
    rm "$DOCROOT/api"
fi
ln -s -T "$DOCROOT/repo/$TIME/src_api" "$DOCROOT/api"

if [ $old_ver -ne -1 ]; then
    rm -rf "$DOCROOT/repo/$old_ver"
fi