import {
  NbComponentStatus,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrService,
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
  Expired: -101
};

export const ResponseMessage = {
  Success: 'success',
  Duplicate: 'data duplicate',
  EmailDuplicate: 'Email is already registered.',
  NoContent: 'content not found.',
  NotFound: 'data not found.'
};

export enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Blocked = 'blocked',
  Deleted = 'deleted'
}

export enum Prefix {
  Mister = 'mr',
  Miss = 'miss',
  Mrs = 'mrs',
  Other = 'other',
  Undefined = 'undefined'
}

export enum Role {
  Admin = 'admin',
  Officer = 'officer',
  Sale = 'sale',
  SuperAdmin = 'superadmin'
}

export enum DiscountType {
  Percentage = '%',
  Amount = 'amt',
}

export const Token = 'Authentication';

export enum HolidayFrequency {
  Yearly = 'yearly',
  Monthly = 'monthly',
  Weekly = 'weekly',
  Daily = 'daily',
}

export enum HolidayType {
  Static = 'static',
  Dynamic = 'dynamic'
}

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
  Edit = 'edit'
}

export const Paging = {
  pageSizeOptions: [10, 25, 50, 100]
}

export const ToasteConfig = {
  destroyByClick: true,
  duration: 5000,
  hasIcon: true,
  position: NbGlobalPhysicalPosition.TOP_RIGHT,
  preventDuplicates: false,
  status: 'success',
}
