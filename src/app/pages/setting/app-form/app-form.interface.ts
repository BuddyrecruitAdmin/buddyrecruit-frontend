export interface IAppFormTemplate {
  _id?;
  refCompany: any;
  companyName: string;
  formName: string;
  formRemark: string;
  isExpress: boolean;
  active: boolean;

  title: string;
  subTitle: string;
  bgColor: string;
  titleColor: string;
  subTitleColor: string;
  jobRemark: string;
  jobRemarkColor: string;
  questions: IQuestion[];
  personalDetail: {
    active: boolean;
    idCard: IAction;
    firstnameEN: IAction;
    lastnameEN: IAction;
    firstname: IAction;
    lastname: IAction;
    birth: IAction;
    age: IAction;
    phone: IAction;
    reservePhone: IAction;
    email: IAction;
    address: IAction;
    addressNo: IAction;
    road: IAction;
    district: IAction;
    province: IAction;
    postcode: IAction;
    gender: IAction;
    expectedSalary: IAction;
    // facebook: IAction;
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
  };
  refPositions: string[];
  logoURL: string;
}

export interface IQuestion {
  type: string;
  title: string;
  subTitle: string;
  showSubTitle: boolean;
  required: boolean;
  imgaeURL: string;
  answer: IAnswer;
  linear: {
    fromLabel: string;
    fromValue: number;
    toLabel: string;
    toValue: number;
  };
  grid: {
    rows: IGridOption[];
    columns: IGridOption[];
  },
  parentChild: IParent[];
  parentSelected: number;
  childSelected: number;
  multiChilds: any;
  isFilter: boolean;
  score: IScore;
  isLoading: boolean;
}

export interface IAnswer {
  input: string;
  textArea: string;
  options: IOption[];
  selected: number;
  expected: number;
  hasOther: boolean;
  otherLabel: string;
  otherChecked: boolean;
  otherInput: string;
  otherScore: number;
  attachment: IAttachment;
  linearValue: number;
  linearOptions: ILinearOption[];
  gridRadio: IGridRadio[];
  gridCheckbox: IGridCheckbox[];
  date: Date;
  time: ITime;
}

export interface IOption {
  label: string;
  imgaeURL: string;
  checked?: boolean;
  maxScore: number;
}

export interface IAction {
  visible: boolean;
  editable: boolean;
  disabled: boolean;
  required: boolean;
}

export interface ITreeNode {
  refPosition?: any;
  name: string;
  required: boolean;
  isMultiAnswer: boolean;
  children?: ITreeNode[];
}

export interface IAttachment {
  uploadName: string;
  originalName: string;
  type: string;
  size: number;
  imgaeURL: string;
  date: Date;
}

export interface IGridOption {
  label: string;
  maxScore: number;
}

export interface IGridRadio {
  rowName: string;
  value: string;
}

export interface IGridCheckbox {
  rowName: string;
  columns: IColumn[];
}

export interface IColumn {
  colName: string;
  maxScore: number;
  checked: boolean;
}

export interface ITime {
  hour: number;
  minute: number;
}

export interface IScore {
  isAnswer: boolean;
  isScore: boolean;
  maxScore: number;
  keywords: string[];
  girdRowScore: number;
  submitScore: number;
}

export interface ILinearOption {
  label: number;
  maxScore: number;
}

export interface IParent {
  name: string;
  required: boolean;
  isMultiAnswer: boolean;
  children: IChild[];
  maxScore: number;
}

export interface IChild {
  name: string;
}
