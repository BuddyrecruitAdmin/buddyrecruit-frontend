export interface IAppFormTemplate {
  _id?;
  refCompany: any;
  formName: string;
  formRemark: string;

  title: string;
  subTitle: string;
  bgColor: string;
  titleColor: string;
  subTitleColor: string;
  questions: IQuestion[];
  personalDetail: {
    active: boolean;
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
  };
  workExperience: {
    active: boolean;
    position: IAction;
    company: IAction;
    start: IAction;
    end: IAction;
    isPresent: IAction;
    duty: IAction;
  };
  education: {
    active: boolean;
    refDegree: IAction;
    gpa: IAction;
    university: IAction;
    major: IAction;
  };
  hardSkill: {
    active: boolean;
  };
  softSkill: {
    active: boolean;
  };
  certificate: {
    active: boolean;
  };
  uploadCV: {
    active: boolean;
  }
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

export interface IAction {
  visible: boolean;
  editable: boolean;
  disabled: boolean;
  required: boolean;
} 
