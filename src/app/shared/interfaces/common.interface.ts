export interface ApiResponse {
  data?;
  filter?;
  code: number;
  status?: string;
  done?: boolean;
  startAt?;
  message?: string;
  totalDataSize?: number;
  count?: Count;
  isOverQuota?: boolean;
  isOverCandidate?: boolean;
  otherJR?;
  usedTime?;
  isExpired?;
  token?: string;
  headers?: any;
  jobType?: any;
}

export interface Count {
  data?: number;
  notBuy?: number;
  pending?: number;
  selected?: number;
  rejected?: number;
  started?: number;
  unread?: number;
  unRead?: number;
  unseen?: number;
}

export interface Authentication {
  token: string;
  role: string;
}

export interface DropDownValue {
  label: string;
  value: any;
}

export interface DropDownLangValue {
  label: Language;
  value: any;
  remark?: string;
}

export interface DropDownGroup {
  group: string;
  label: string;
  value: string;
}

export interface Language {
  th: string;
  en: string;
}

export interface Picture {
  base64: string;
  width: number;
  height: number;
  size: number;
  type: string;
  name: string;
}

export interface Filter {
  name: string;
  value: string[];
}

export interface Criteria {
  keyword?: string;
  skip?: number;
  limit?: number;
  filter?: string[];
  filters?: Filter[];
  questionFilters?: Filter[];
  sortOrderBy?: string;
}

export interface Paging {
  length: number;
  pageIndex: number;
  pageSize: number;
  pageSizeOptions: number[];
}

export interface Address {
  address: string;
  province: string;
  postalCode: Number;
  location?: string;
  isDefault?: boolean;
}

export interface Devices {
  isMobile: boolean;
  isTablet: boolean;
  isNotebook: boolean;
  isPC: boolean;
  other: boolean;
}
