import { Token, Url } from '../app.constants';
import { Authentication as IAuthentication } from '../interfaces/common.interface';

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

export function setUrl(url: string = '') {
  localStorage.setItem(Url, JSON.stringify(url));
}

export function getUrl() {
  const url = JSON.parse(localStorage.getItem(Url));
  return (!url || url === null || url === '/') ? undefined : url;
}

// }
