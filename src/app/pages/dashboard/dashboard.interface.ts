export interface BarChart {
  departmentId: string;
  departmentName: string;
  jrId: string;
  jrName: string;
  horizontalAxe: string;
  verticalAxe: string;
}

export interface PieChart {
  departmentId: string;
  departmentName: string;
  jrId: string;
  jrName: string;
}

export interface ITimeToFill {
  applications: ITimeToFillConfig;
  screened: ITimeToFillConfig;
  examPassed: ITimeToFillConfig;
  interviewed: ITimeToFillConfig;
  singedContract: ITimeToFillConfig;
  jobStarted: ITimeToFillConfig;
}

export interface ITimeToFillConfig {
  name: string;
  bgColor: string;
  countPerson: number;
  countDays: number;
  avgDays: number;
  percent: number;
  data: any;
}
