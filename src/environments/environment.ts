declare var window: any;
export const environment = {
  production: window.appConfig.API_PROD, 
  API_URI: window.appConfig.API_URI, 
  WriteLog: true 
};
