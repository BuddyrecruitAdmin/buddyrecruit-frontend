import { isDevMode } from "@angular/core";
import { environment } from "../../../environments/environment";

export function WriteLog(message?: any, ...optionalParams: any[]) {
  if (!environment.production || isDevMode) {
    // console.log('- - - - - - - - ## L O G ## - - - - - - - -');
    // console.log(message, ...optionalParams);
  }
}

export function WriteInfoLog(message?: any, ...optionalParams: any[]) {
  if (!environment.production || isDevMode) {
    // console.info('- - - - - - - - ## I N F O ## - - - - - - - -');
    // console.info(message, ...optionalParams);
  }
}

export function WriteErrorLog(message?: any, ...optionalParams: any[]) {
  if (!environment.production || isDevMode) {
    // console.error('- - - - - - - - ## E R R O R ## - - - - - - - -');
    // console.error(message, ...optionalParams);
  }
}
