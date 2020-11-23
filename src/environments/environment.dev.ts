// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // API_URI: 'http://192.168.25.59:4201', //DEV P KG LAN
  // API_URI: 'http://192.168.25.59:9001', //DEV P KG LAN
  // API_URI: 'http://192.168.35.146:4201', //DEV P KG  WIFI
  // API_URI: 'http://192.168.35.102:4201', //DEV P MO
  // API_URI: 'http://192.168.25.56:4201', //DEV my com
  API_URI: 'http://192.168.35.50:9001', //DEV P KG LAN
  WriteLog: true
};
