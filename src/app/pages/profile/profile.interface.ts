
export interface IProfile {
  _id: string;
  title: string;
  firstname: string;
  lastname: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  ref_company?: {
    _id: string;
    name: string;
  };
  ref_department: {
    _id: string;
    name: string;
  };
  ref_role: {
    _id: string;
    name: string;
  };
}
export interface IOldProfile {
  _id: string;
  title: string;
  firstname: string;
  lastname: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  ref_company?: {
    _id: string;
    name: string;
  };
  ref_department: {
    _id: string;
    name: string;
  };
  ref_role: {
    _id: string;
    name: string;
  };
}

export interface ISaveProfile {
  firstname: string;
  lastname: string;
  email: string;
  oldPassword: string;
  newPassword: string;
}
