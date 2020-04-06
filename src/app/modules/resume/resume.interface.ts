export interface IResume {
  _id?;
  firstname: string;
  lastname: string;
  birth: Date;
  age: number;
  phone: string;
  email: string;
  address: string;
  gender: string;
  expectedSalary: string;

  workExperience: IWorkExperience;
  education: IEducation[];
  hardSkill: string[];
  softSkill: string[];
  certificate: string[];

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
  originalname: string;
  uploadName: string;
}