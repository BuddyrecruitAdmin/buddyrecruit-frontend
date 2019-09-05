export interface ApiResponse {
  data?;
  code: number;
  status?: string;
  message?: string;
  totalDataSize?: number;
}

export interface Authentication {
  token: string;
  role: string;
}

export interface DropDownValue {
  label: string;
  value: string;
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

export interface Criteria {
  keyword?: string;
  skip?: number;
  limit?: number;
  filter?: string[];
}

export interface Paging {
  length: number;
  pageIndex: number;
  pageSize: number;
  pageSizeOptions: number[];
}

export interface Addresses {
  address: string;
  province: string;
  postalCode: Number;
  location?: string;
}

export interface Devices {
  isMobile: boolean;
  isTablet: boolean;
  isNotebook: boolean;
  isPC: boolean;
  other: boolean;
}
