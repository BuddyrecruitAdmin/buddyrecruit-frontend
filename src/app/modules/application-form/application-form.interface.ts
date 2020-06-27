import { IQuestion } from '../../pages/setting/app-form/app-form.interface';

export interface IApplicationForm {
  _id?;
  refCompany?;
  refTemplate?;
  refJR?;
  hubs?: any;
  otherJob: string;
  title: string;
  titleTH: string;
  idCard: string;
  firstnameEN: string;
  lastnameEN: string;
  firstname: string;
  lastname: string;
  birth: Date;
  age: number;
  phone: string;
  email: string;
  address: string;
  addressNo: string;
  road: string;
  district: string;
  province: string;
  postcode: string;
  gender: string;
  expectedSalary: string;
  isReserve: boolean;
  
  workExperience: IWorkExperience;
  education: IEducation[];
  hardSkill: string[];
  softSkill: string[];
  certificate: string[];
  questions: IQuestion[];

  refPosition: any;
  jobSelected: string;
  jobChildSelected: string;
  jobMultiChild: any;

  attachment: IAttachment;
}

export interface IWorkExperience {
  totalExpMonth: number;
  work: IWork[];
}

export interface IWork {
  position: string;
  company: string;
  start: Date;
  end: Date;
  isPresent: boolean;
  duty: string;
  expMonth: number;
  deletion: boolean;
}

export interface IEducation {
  refDegree: string;
  gpa: string;
  university: string;
  major: string;
  deletion: boolean;
}

export interface IAttachment {
  uploadName: string;
  originalName: string;
  type: string;
  size: number;
}
