// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // API_URI: "http://localhost:4201", // LOCAL
  // API_URI: 'http://10.99.0.50:9001', // DEV P KG
  API_URI: 'http://3fbde2ca.ngrok.io', // DEV N gos 15
  // API_URI: 'http://10.25.0.151:9001', // DEV N gos 6 
  // API_URI: 'http://192.168.35.87:9001', // DEV P'Mo
  WriteLog: true
};
