import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Token, Role } from '../app.constants';
import { Authentication as IAuthentication } from '../interfaces/common.interface';

// @Injectable({
//     providedIn: 'root'
// })
// export class AuthenticationService {

//     constructor(private router: Router) { }


export function setAuthentication(authentication?: IAuthentication): void {
  if (authentication) {
    localStorage.setItem(Token, JSON.stringify(authentication));
  } else {
    localStorage.removeItem(Token);
  }
}

export function getAuthentication(): IAuthentication {
  const token: IAuthentication = JSON.parse(localStorage.getItem(Token));
  return (!token || token === null) ? undefined : token;
}

export function getToken(): string {
  const token: IAuthentication = JSON.parse(localStorage.getItem(Token));
  return (!token || token === null) ? undefined : token.token;
}

export function getRole(): any {
  const token: IAuthentication = JSON.parse(localStorage.getItem(Token));
  return (!token || token === null) ? undefined : token.role;
}

export function checkPermission(): string {
  return '';
}

// }
