#!/bin/bash
set -e

mkdir -p /state/{{ site_name }}

if [ ! -f "/state/{{ site_name }}/mysql" ]; then
mariadb --user=root <<EOF
    CREATE USER '{{ sql["user"] }}'@'{{ sql["host"] }}' IDENTIFIED BY '{{ sql["password"] }}';
    CREATE DATABASE {{ sql["db"] }};
    GRANT ALL PRIVILEGES ON {{ sql["db"] }}.* TO '{{ sql["user"] }}'@'{{ sql["host"] }}' WITH GRANT OPTION;
    FLUSH PRIVILEGES;
    exit
EOF

    touch "/state/{{ site_name }}/mysql"
fi