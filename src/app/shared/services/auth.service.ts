import {
  Token,
  Url,
  CandidateId,
  FlowId,
  JdId,
  JdName,
  JrId,
  Keyword,
  TabName,
  Collapse,
  ButtonId,
  DateTime,
  IsGridLayout,
  BugId,
  FieldLabel,
  FieldName,
  UserCandidate
} from '../app.constants';
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

export function setKeyword(keyword: string = null) {
  localStorage.setItem(Keyword, JSON.stringify(keyword));
}

export function getKeyword() {
  const keyword = JSON.parse(localStorage.getItem(Keyword));
  return (!keyword || keyword === null) ? undefined : keyword;
}

export function setTabName(tabName: string = null) {
  localStorage.setItem(TabName, JSON.stringify(tabName));
}

export function getTabName() {
  const tabName = JSON.parse(localStorage.getItem(TabName));
  return (!tabName || tabName === null) ? undefined : tabName;
}

export function setButtonId(buttonId: string = null) {
  localStorage.setItem(ButtonId, JSON.stringify(buttonId));
}

export function getButtonId() {
  const buttonId = JSON.parse(localStorage.getItem(ButtonId));
  return (!buttonId || buttonId === null) ? undefined : buttonId;
}

export function setCollapse(collapse: boolean = true) {
  localStorage.setItem(Collapse, JSON.stringify(collapse));
}

export function getCollapse() {
  const collapse = JSON.parse(localStorage.getItem(Collapse));
  return (collapse === undefined || collapse === null) ? true : collapse;
}

export function setDate(date: Date = null) {
  localStorage.setItem(DateTime, JSON.stringify(date));
}

export function getDate() {
  const date = JSON.parse(localStorage.getItem(DateTime));
  return (date === undefined || date === null) ? new Date() : new Date(date);
}

export function setIsGridLayout(isGridLayout: boolean = true) {
  localStorage.setItem(IsGridLayout, JSON.stringify(isGridLayout));
}

export function getIsGridLayout() {
  const isGridLayout = JSON.parse(localStorage.getItem(IsGridLayout));
  return (isGridLayout === undefined || isGridLayout === null) ? undefined : isGridLayout;
}

export function setBugId(bugId: any = null) {
  localStorage.setItem(BugId, JSON.stringify(bugId));
}

export function getBugId() {
  const bugId = JSON.parse(localStorage.getItem(BugId));
  return (!bugId || bugId === null) ? undefined : bugId;
}

export function setFieldLabel(fieldLabel: any = null) {
  localStorage.setItem(FieldLabel, JSON.stringify(fieldLabel));
}

export function getFieldLabel() {
  const fieldLabel = JSON.parse(localStorage.getItem(FieldLabel));
  return (!fieldLabel || fieldLabel === null) ? undefined : fieldLabel;
}

export function setFieldName(fieldName: any = null) {
  localStorage.setItem(FieldName, JSON.stringify(fieldName));
}

export function getFieldName() {
  const fieldName = JSON.parse(localStorage.getItem(FieldName));
  return (!fieldName || fieldName === null) ? undefined : fieldName;
}

export function setUserCandidate(userCandidate: any = null) {
  localStorage.setItem(UserCandidate, JSON.stringify(userCandidate));
}

export function getUserCandidate() {
  const userCandidate = JSON.parse(localStorage.getItem(UserCandidate));
  return (!userCandidate || userCandidate === null) ? undefined : userCandidate;
}
