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
  BugCandidateId,
  FieldLabel,
  FieldName,
  UserCandidate,
  ContactId,
  UserEmail,
  IconId,
  OutlookToken,
  GoogleToken,
  Notification,
  NotifIndex,
  LangPath,
  Language,
  allList,
  allListName,
  examId,
  AppFormData
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
export function setIconId(iconId: string = null) {
  localStorage.setItem(IconId, JSON.stringify(iconId));
}

export function getIconId() {
  const iconId = JSON.parse(localStorage.getItem(IconId));
  return (!iconId || iconId === null) ? undefined : iconId;
}

export function setCollapse(collapse: boolean = true) {
  localStorage.setItem(Collapse, JSON.stringify(collapse));
}

export function getCollapse() {
  const collapse = JSON.parse(localStorage.getItem(Collapse));
  return (collapse !== true && collapse !== false) ? true : collapse;
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

export function setBugCandidateId(bugCandidateId: any = null) {
  localStorage.setItem(BugCandidateId, JSON.stringify(bugCandidateId));
}

export function getBugCandidateId() {
  const bugCandidateId = JSON.parse(localStorage.getItem(BugCandidateId));
  return (!bugCandidateId || bugCandidateId === null) ? undefined : bugCandidateId;
}

export function setContactId(contactId: any = null) {
  localStorage.setItem(ContactId, JSON.stringify(contactId));
}

export function getContactId() {
  const contactId = JSON.parse(localStorage.getItem(ContactId));
  return (!contactId || contactId === null) ? undefined : contactId;
}

export function setUserEmail(userEmail: string = null) {
  localStorage.setItem(UserEmail, JSON.stringify(userEmail));
}

export function getUserEmail() {
  const userEmail = JSON.parse(localStorage.getItem(UserEmail));
  return (!userEmail || userEmail === null) ? undefined : userEmail;
}

export function setOutlookToken(outlookToken: string = null) {
  localStorage.setItem(OutlookToken, JSON.stringify(outlookToken));
}

export function getOutlookToken() {
  const outlookToken = JSON.parse(localStorage.getItem(OutlookToken));
  return (!outlookToken || outlookToken === null) ? undefined : outlookToken;
}

export function setGoogleToken(googleToken: string = null) {
  localStorage.setItem(GoogleToken, JSON.stringify(googleToken));
}

export function getGoogleToken() {
  const googleToken = JSON.parse(localStorage.getItem(GoogleToken));
  return (!googleToken || googleToken === null) ? undefined : googleToken;
}

export function setNotification(notification: string = null) {
  localStorage.setItem(Notification, JSON.stringify(notification));
}

export function getNotification() {
  const notification = JSON.parse(localStorage.getItem(Notification));
  return (!notification || notification === null) ? undefined : notification;
}

export function setNotificationIndex(notifIndex: any = null) {
  localStorage.setItem(NotifIndex, JSON.stringify(notifIndex));
}

export function getNotificationIndex() {
  const notifIndex = JSON.parse(localStorage.getItem(NotifIndex));
  return (!notifIndex || notifIndex === null) ? undefined : notifIndex;
}
export function setLangPath(langPath: any = null) {
  localStorage.setItem(LangPath, JSON.stringify(langPath));
}

export function getLangPath() {
  const langPath = JSON.parse(localStorage.getItem(LangPath));
  return (!langPath || langPath === null) ? undefined : langPath;
}
export function setLanguage(language: any = null) {
  localStorage.setItem(Language, JSON.stringify(language));
}

export function getLanguage() {
  const language = JSON.parse(localStorage.getItem(Language));
  return (!language || language === null) ? undefined : language;
}
export function setAllList(all: any = null) {
  localStorage.setItem(allList, JSON.stringify(all));
}

export function getAllList() {
  const all = JSON.parse(localStorage.getItem(allList));
  return (!all || all === null) ? undefined : all;
}
export function setAllListName(allName: any = null) {
  localStorage.setItem(allListName, JSON.stringify(allName));
}

export function getAllListName() {
  const allName = JSON.parse(localStorage.getItem(allListName));
  return (!allName || allName === null) ? undefined : allName;
}

export function setExamId(exam: string = null) {
  localStorage.setItem(examId, JSON.stringify(exam));
}

export function getExamId() {
  const exam = JSON.parse(localStorage.getItem(examId));
  return (!exam || exam === null) ? undefined : exam;
}

export function setAppFormData(data: any = null) {
  localStorage.setItem(AppFormData, JSON.stringify(data));
}

export function getAppFormData() {
  const data = JSON.parse(localStorage.getItem(AppFormData));
  return (!data || data === null) ? undefined : data;
}