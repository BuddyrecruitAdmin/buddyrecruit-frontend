export interface IAppForm {
  _id?;
  refCompany: any;
  formName: string;
  formRemark: string;
  questions: IQuestion[];
  fieldControl: IFieldControl;
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

export interface IQuestion {
  type: string;
  title: string;
  subTitle: string;
  showSubTitle: boolean;
  required: boolean;
  answer?: IAnswer;
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
  checked?: boolean;
}

export interface IFieldControl {
  firstname: IAction;
  lastname: IAction;
  birth: IAction;
  age: IAction;
  phone: IAction;
  email: IAction;
  address: IAction;
  addressNo: IAction;
  road: IAction;
  district: IAction;
  province: IAction;
  postcode: IAction;
  gender: IAction;
  expectedSalary: IAction;

  personalDetail: IAction;
  workExperience: IAction;
  education: IAction;
  hardSkill: IAction;
  softSkill: IAction;
  certificate: IAction;
}

export interface IAction {
  visible: boolean;
  editable: boolean;
  disabled: boolean;
  required: boolean;
} 
