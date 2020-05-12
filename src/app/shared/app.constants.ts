import {
  NbGlobalPhysicalPosition,
} from '@nebular/theme';

export const ResponseCode = {
  Success: 200,
  NoContent: 204,
  BadRequest: 400,
  NotFound: 404,
  Unauthorized: 401,
  Catch: -99,
  Error: -1,
  Duplicate: -1100,
  Expired: -101,
};

export const ResponseMessage = {
  Success: 'success',
  Duplicate: 'data duplicate',
  EmailDuplicate: 'Email is already registered.',
  NoContent: 'content not found.',
  NotFound: 'data not found.',
};

export enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Blocked = 'blocked',
  Deleted = 'deleted',
}

export enum Prefix {
  Mr = 'Mr.',
  Miss = 'Miss',
  Mrs = 'Mrs.',
  NotSpecify = 'Not Specify',
}

export enum Role {
  SuperAdmin = 'Super Admin',
  Admin = 'Admin',
  Hr = 'Hr',
  Manager = 'Manager',
  Py = 'Payroll',
}

export const Token = 'Authentication';
export const Url = 'Url';
export const JdId = 'JdId';
export const JdName = 'JdName';
export const JrId = 'JrId';
export const CandidateId = 'CandidateId';
export const FlowId = 'FlowId';
export const Keyword = 'Keyword';
export const TabName = 'TabName';
export const Collapse = 'Collapse';
export const ButtonId = 'ButtonId';
export const IconId = 'IconId';
export const DateTime = 'DateTime';
export const IsGridLayout = 'IsGridLayout';
export const BugId = 'BugId';
export const BugCandidateId = 'BugCandidateId';
export const FieldLabel = 'FieldLabel';
export const FieldName = 'FieldName';
export const UserCandidate = 'UserCandidate';
export const ContactId = 'ContactId';
export const UserEmail = 'UserEmail';
export const OutlookToken = 'OutlookToken';
export const GoogleToken = 'GoogleToken';
export const Notification = 'Notification';
export const NotifIndex = 'NotifIndex';
export const LangPath = 'LangPath';
export const Language = 'Language';
export const allList = 'allList';
export const allListName = 'allListName';
export const examId = 'examId';
export const AppFormData = 'AppFormData';
export const flagExam = 'flagExam';
export const ExamData = 'ExamData';
export const PathName = 'PathName';

export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Firday = 5,
  Saturday = 6
}

export enum State {
  Create = 'create',
  Edit = 'edit',
  Preview = 'preview',
  Duplicate = 'duplicate',
  Submit = 'submit',
}

export const Paging = {
  pageSizeOptions: [10, 25, 50, 100]
};

export const ToasteConfig = {
  destroyByClick: true,
  duration: 5000,
  hasIcon: true,
  position: NbGlobalPhysicalPosition.TOP_RIGHT,
  preventDuplicates: false,
  status: 'success',
};

export const InnerWidth = {
  XS: 575, // Mobile
  SM: 767, // Tablet
  MD: 991, // Notebook
  LG: 1199, // PC Monitor
};

export const InputType = {
  Label: 'Title',
  Input: 'Short answer',
  TextArea: 'Paragraph',
  Radio: 'Multiple chioce',
  ChcekBox: 'Checkboxs',
  Dropdown: 'Dropdown',
  Upload: 'File upload',
  Linear: 'Linear scale',
  RadioGrid: 'Multiple chioce grid',
  ChcekBoxGrid: 'Checkbox grid',
  Date: 'Date',
  Time: 'Time',
};
