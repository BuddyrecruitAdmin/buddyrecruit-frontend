#!/bin/sh -eu
mkdir -p /usr/share/nginx/html/environment/
./generate_config_js.sh > /usr/share/nginx/html/environment/environment.ts
nginx -g "daemon off;"

