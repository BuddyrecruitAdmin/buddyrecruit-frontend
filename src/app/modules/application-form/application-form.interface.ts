export interface IApplicationForm {
  _id?;
  refCompany?;
  refTemplate?;
  refJR?;
  otherJob: string;
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

  workExperience: IWorkExperience;
  education: IEducation[];
  hardSkill: string[];
  softSkill: string[];
  certificate: string[];
  questions: IQuestion[];

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

export interface IQuestion {
  type: string;
  title: string;
  subTitle: string;
  showSubTitle: boolean;
  required: boolean;
  imgaeURL: string;
  answer: IAnswer;
}

export interface IAnswer {
  input: string;
  textArea: string;
  options: IOption[];
  selected: string;
  hasOther: boolean;
  otherLabel: string;
  otherChecked: boolean;
  otherInput: string;
}

export interface IOption {
  label: string;
  imgaeURL: string;
  checked?: boolean;
}
