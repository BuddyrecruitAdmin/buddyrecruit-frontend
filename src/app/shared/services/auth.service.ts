import { Token, Url, CandidateId, FlowId, JdId, JdName, JrId } from '../app.constants';
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

export function setUrl(url: string = '') {
  localStorage.setItem(Url, JSON.stringify(url));
}

export function getUrl() {
  const url = JSON.parse(localStorage.getItem(Url));
  return (!url || url === null || url === '/') ? undefined : url;
}

export function setJdId(jdId: any = null) {
  localStorage.setItem(JdId, JSON.stringify(jdId));
}

export function getJdId() {
  const jdId = JSON.parse(localStorage.getItem(JdId));
  return (!jdId || jdId === null) ? undefined : jdId;
}

export function setJdName(jdName: any = null) {
  localStorage.setItem(JdName, JSON.stringify(jdName));
}

export function getJdName() {
  const jdName = JSON.parse(localStorage.getItem(JdName));
  return (!jdName || jdName === null) ? undefined : jdName;
}

export function setJrId(jrId: any = null) {
  localStorage.setItem(JrId, JSON.stringify(jrId));
}

export function getJrId() {
  const jrId = JSON.parse(localStorage.getItem(JrId));
  return (!jrId || jrId === null) ? undefined : jrId;
}

export function setCandidateId(candidateId: string = null) {
  localStorage.setItem(CandidateId, JSON.stringify(candidateId));
}

export function getCandidateId() {
  const candidateId = JSON.parse(localStorage.getItem(CandidateId));
  return (!candidateId || candidateId === null) ? undefined : candidateId;
}

export function setFlowId(flowId: string = null) {
  localStorage.setItem(FlowId, JSON.stringify(flowId));
}

export function getFlowId() {
  const flowId = JSON.parse(localStorage.getItem(FlowId));
  return (!flowId || flowId === null) ? undefined : flowId;
}
