// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // API_URI: "http://localhost:4201", // LOCAL
  // API_URI: 'http://192.168.25.59:9001', // DEV P KG LAN
  //API_URI: 'http://192.168.25.59:9101', // DEV P KG 2
  // API_URI: "http://192.168.35.120:4301", // QAS
  // API_URI: "http://192.168.15.44:4201", // PRD
  // API_URI: "https://p3-bkd.buddyrecruit.ai", // QAS
  // API_URI: 'http://192.168.35.50:9001', // DEV N gos
  API_URI: 'http://192.168.35.87:9001', // DEV P'Mo
  WriteLog: true
};
