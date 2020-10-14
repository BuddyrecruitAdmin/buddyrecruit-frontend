#!/bin/sh -eu
cat <<EOF
export const environment = {
  production: $API_PROD,
  API_URI: $API_URL,
  WriteLog: true
};
EOF

