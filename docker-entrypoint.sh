#!/bin/sh -eu
mkdir -p /usr/share/nginx/html/assets/
./generate_config_js.sh > /usr/share/nginx/html/asset/env.js
nginx -g "daemon off;"

