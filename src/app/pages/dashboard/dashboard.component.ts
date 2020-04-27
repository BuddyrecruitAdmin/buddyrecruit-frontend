import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { DashboardService } from './dashboard.service';
import { getRole } from '../../shared/services/auth.service';
import { ResponseCode } from '../../shared/app.constants';
import { ITimeToFill } from './dashboard.interface';
import {
	ChartComponent,
	ApexNonAxisChartSeries,
	ApexResponsive,
	ApexChart
} from "ng-apexcharts";

export type PieChartOptions = {
	series: ApexNonAxisChartSeries;
	chart: ApexChart;
	responsive: ApexResponsive[];
	labels: any;
};
@Component({
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	role: any;
	thisYear = new Date().getFullYear().toString();
	beginYear = 2019;
	reportDate: string;
	rejection = {
		enabled: false,
		year: this.thisYear
	};

	stages = [
		{
			key: "pending_exam",
			value: "Pending Exam"
		},
		{
			key: "pending_appointment",
			value: "Pending Appointment"
		},
		{
			key: "pending_interview",
			value: "Pending Interview"
		},
		{
			key: "pending_sign_contract",
			value: "Pending Sign Contract"
		},
		{
			key: "onboard",
			value: "Onboard"
		},
	];

	filterStatus = {
		department: "ALL",
		departments: [],
		position: "ALL",
		positions: [],
		stage: "onboard",
		stages: this.stages
	};
	filterRejection = {
		year: this.thisYear,
		years: [],
		department: "ALL",
		departments: [],
		position: "ALL",
		positions: []
	};
	filterTimeToFill = {
		year: this.thisYear,
		years: [],
		department: "ALL",
		departments: [],
		position: "ALL",
		positions: []
	};

	enabledRecruitStatus: boolean;
	enabledRejection: boolean;
	enabledTimeToFill: boolean;
	enabledJobboard: boolean;
	noData: boolean;

	recruiteData: any;
	rejectionData: any;
	timeToFillData: any;

	legendLabel: any;
	legendPosition: any;
	aspectRatio: any;

	loading = true;
	loadingTimeToFill = true;

	// Color master
	backgroundColor = [
		'#D98880',
		'#C39BD3',
		'#7FB3D5',
		'#76D7C4',
		'#7DCEA0',
		'#F9E79F',
		'#F0B27A',
		'#F1948A',
		'#BB8FCE',
		'#85C1E9',
		'#73C6B6',
		'#82E0AA',
		'#F8C471',
		'#E59866'
	];

	// Recruitment Status Report
	public bubbleChartLegend = true;
	public bubbleChartType: ChartType = 'bubble';
	public bubbleChartOptions: ChartOptions;
	public bubbleChartData: ChartDataSets[];
	public bubbleChartColors: Color[] = [
		{ backgroundColor: this.backgroundColor }
	];

	// Company Reject Reason
	public barChartLegend = false;
	public barChartType: string = 'horizontalBar';
	public barChartOptions: ChartOptions;
	public barChartLabels: Label[] = [];
	public barChartData: ChartDataSets[];
	public barChartPlugins = [pluginDataLabels];
	public barChartColors: Color[] = [
		{ backgroundColor: this.backgroundColor }
	];

	// Candidate Reject Reason
	public barChart2Legend = false;
	public barChart2Type: string = 'horizontalBar';
	public barChart2Options: ChartOptions;
	public barChart2Labels: Label[] = [];
	public barChart2Data: ChartDataSets[];
	public barChart2Plugins = [pluginDataLabels];
	public barChart2Colors: Color[] = [
		{ backgroundColor: this.backgroundColor }
	];

	timeToFill: ITimeToFill;

	@ViewChild("chart", { static: true }) chart: ChartComponent;
	public pieChartOptions: Partial<PieChartOptions>;
	pieOption: any = [];
	pieLabels: any = [];
	jobData: any;

	constructor(
		private service: DashboardService,
		public sanitizer: DomSanitizer,
	) {
		this.role = getRole();
		this.enabledRecruitStatus = false;
		this.enabledRejection = false;
		this.enabledJobboard = false;
	}

	ngOnInit() {
		if (window.innerWidth <= 530) { // iphone 6/7/8 plus
			this.legendPosition = "bottom";
			this.legendLabel = false;
			this.aspectRatio = 1;
		} else {
			this.legendPosition = "right";
			this.legendLabel = true;
			this.aspectRatio = 2;
		}
		this.bubbleChartData = [];
		this.barChartData = [];
		this.barChart2Data = [];
		this.timeToFill = this.initialTimeToFill();

		this.getDashboard();
	}

	initialTimeToFill(): ITimeToFill {
		return {
			applications: {
				name: 'Applications',
				bgColor: '#F0B27A',
				countPerson: 0,
				countDays: 0,
				avgDays: 0,
				percent: 100,
				data: [],
			},
			screened: {
				name: 'Screened',
				bgColor: '#D98880',
				countPerson: 0,
				countDays: 0,
				avgDays: 0,
				percent: 0,
				data: [],
			},
			examPassed: {
				name: 'Exam Passed',
				bgColor: '#C39BD3',
				countPerson: 0,
				countDays: 0,
				avgDays: 0,
				percent: 0,
				data: [],
			},
			interviewed: {
				name: 'Interviewed',
				bgColor: '#7FB3D5',
				countPerson: 0,
				countDays: 0,
				avgDays: 0,
				percent: 0,
				data: [],
			},
			singedContract: {
				name: 'Singed Contract',
				bgColor: '#85C1E9',
				countPerson: 0,
				countDays: 0,
				avgDays: 0,
				percent: 0,
				data: [],
			},
			jobStarted: {
				name: 'Job Started',
				bgColor: '#76D7C4',
				countPerson: 0,
				countDays: 0,
				avgDays: 0,
				percent: 0,
				data: [],
			},
		}
	}

	// ------------------------------------------------------------------
	// Get Dashboard
	// ------------------------------------------------------------------

	getDashboard() {
		this.loading = true;
		this.noData = true;
		this.service.getList(undefined, this.role.refCompany).subscribe(response => {
			if (response.code === ResponseCode.Success) {
				if (response.data && response.data.length) {
					// Recruitment Status Report
					if (response.data.find(element => {
						return element.active && element.refDashboard.code === 'DASHBOARD_01';
					})) {
						this.enabledRecruitStatus = true;
					}
					// Rejection Analysis Report
					if (response.data.find(element => {
						return element.active && element.refDashboard.code === 'DASHBOARD_02';
					})) {
						this.enabledRejection = true;
					}
					// Jobboard Report
					if (response.data.find(element => {
						return element.active && element.refDashboard.code === 'DASHBOARD_03';
					})) {
						this.enabledJobboard = true;
					}
					// Time to Fill
					if (response.data.find(element => {
						return element.active && element.refDashboard.code === 'DASHBOARD_04';
					})) {
						this.enabledTimeToFill = true;
						this.getTimeToFill(this.thisYear);
					}
				}

				if (this.enabledRecruitStatus || this.enabledRejection || this.enabledJobboard) {
					this.rejection = {
						enabled: this.enabledRejection,
						year: this.thisYear
					};
					this.service.getDashboard(this.enabledRecruitStatus, this.rejection, this.enabledJobboard).subscribe(response => {
						this.loading = false;
						this.noData = false;
						this.getDashboardSuccess(response);
					});
				} else {
					this.loading = false;
				}
			} else {
				this.loading = false;
			}
		});
	}

	getDashboardSuccess(res: any) {
		const that = this;
		let thisYear = parseInt(this.thisYear);
		if (this.enabledRecruitStatus) {
			this.recruiteData = res.data;
			this.setChartRecruitmentStatus();
			this.recruiteData.recruitmentStatus.map(function (item) {
				// Set default filter
				that.filterStatus.departments.push(item.department.name);
				that.filterStatus.positions.push(item.position);
			});
			this.filterStatus.departments = this.removeDups(this.filterStatus.departments);
			this.filterStatus.positions = this.removeDups(this.filterStatus.positions);
		}
		if (this.enabledRejection) {
			this.rejectionData = res.data;
			this.setChartCompanyReject();
			this.setChartCandidateReject();

			// Set default filter
			while (thisYear >= this.rejectionData.beginYear) {
				this.filterRejection.years.push(thisYear);
				thisYear--;
			}
			this.rejectionData.rejection.company.map(function (item) {
				that.filterRejection.departments.push(item.department.name);
				that.filterRejection.positions.push(item.position);
			});
			this.rejectionData.rejection.candidate.map(function (item) {
				that.filterRejection.departments.push(item.department.name);
				that.filterRejection.positions.push(item.position);
			});
			this.filterRejection.departments = this.removeDups(this.filterRejection.departments);
			this.filterRejection.positions = this.removeDups(this.filterRejection.positions);
			// this.loading = false;
		}
		if (this.enabledJobboard) {
			this.pieLabels = Object.keys(res.data.jobboard);
			this.pieOption = Object.values(res.data.jobboard);
			this.pieChartOptions = {
				series: this.pieOption,
				chart: {
					type: "donut"
				},
				labels: this.pieLabels,
				responsive: [
					{
						breakpoint: 480,
						options: {
							chart: {
								width: 200
							},
							legend: {
								position: "bottom"
							}
						}
					}
				]
			};
		}

	}
	getDashboardFailed(err: any) { }

	// ------------------------------------------------------------------
	// Recruitment Status Report
	// ------------------------------------------------------------------

	setChartRecruitmentStatus() {
		const that = this;
		const today = new Date();
		const data = JSON.parse(JSON.stringify(this.recruiteData));
		this.reportDate = this.convertDateReport(today);
		let maxScaleX = 100;
		let minScaleY = 0;
		let maxScaleY = 100;

		this.bubbleChartData = [];

		// filter data by department
		if (this.filterStatus.department && this.filterStatus.department !== "ALL") {
			data.recruitmentStatus = data.recruitmentStatus.filter(function (item) {
				return item.department.name === that.filterStatus.department;
			});
			// set filter position relate with department
			data.recruitmentStatus.map(function (item) {
				that.filterStatus.positions.push(item.position);
			});
		} else {
			this.recruiteData.recruitmentStatus.map(function (item) {
				that.filterStatus.positions.push(item.position);
			});
		}
		// filter data by position
		if (this.filterStatus.positions && this.filterStatus.position !== "ALL") {
			data.recruitmentStatus = data.recruitmentStatus.filter(function (item) {
				return item.position === that.filterStatus.position;
			});
		}

		let reasonKey = [];
		data.recruitmentStatus.map(function (item) {
			reasonKey.push(item.position);
		});
		reasonKey.sort();
		reasonKey = this.removeDups(reasonKey);
		reasonKey.map((item1, index) => {
			const item = data.recruitmentStatus.find(function (item2) {
				return item2.position === item1;
			});

			const startDate = new Date(item.duration.startDate);
			const endDate = new Date(item.onboardDate);
			const workingDays = this.getDiffDaysBetween2Date(startDate, today);
			const targetDays = this.getDiffDaysBetween2Date(startDate, endDate);

			const percentX = this.calPercentageBetween2Number(workingDays, targetDays);
			let percentY: number;
			switch (this.filterStatus.stage) {
				case this.stages[0].key: // Pending Exam
					percentY = this.calPercentageBetween2Number(item.pending_exam, item.capacity);
					if (isNaN(percentY)) {
						percentY = 0;
					}
					break;
				case this.stages[1].key: // Pending Appointment
					percentY = this.calPercentageBetween2Number(item.pending_appointment, item.capacity);
					if (isNaN(percentY)) {
						percentY = 0;
					}
					break;
				case this.stages[2].key: // Pending Interview
					percentY = this.calPercentageBetween2Number(item.pending_interview, item.capacity);
					if (isNaN(percentY)) {
						percentY = 0;
					}
					break;
				case this.stages[3].key: // Pending Sign Contract
					percentY = this.calPercentageBetween2Number(item.pending_sign_contract, item.capacity);
					if (isNaN(percentY)) {
						percentY = 0;
					}
					break;
				case this.stages[4].key: // Onboard
					percentY = this.calPercentageBetween2Number(item.onboard, item.capacity);
					if (isNaN(percentY)) {
						percentY = 0;
					}
					break;
				default:
					percentY = this.calPercentageBetween2Number(item.onboard, item.capacity);
					if (isNaN(percentY)) {
						percentY = 0;
					}
			}

			const color = this.getColorByIndex(index);
			this.bubbleChartData.push({
				data: [
					{ x: percentX, y: percentY, r: item.capacity },
				],
				label: item.position,
				backgroundColor: color,
				pointRadius: 100
			});
			// console.log(this.bubbleChartData)
			if (maxScaleX < percentX) {
				maxScaleX = percentX;
			}
			if (percentY === 0) {
				minScaleY = -20;
			}
			if (maxScaleY < percentY) {
				maxScaleY = percentY;
			}
		});

		// data.recruitmentStatus.map(function (item, index) {
		// 	const startDate = new Date(item.duration.start_date);
		// 	const endDate = new Date(item.onboard_date);

		// 	const workingDays = that.getDiffDaysBetween2Date(startDate, today);
		// 	const targetDays = that.getDiffDaysBetween2Date(startDate, endDate);

		// 	const percentX = that.calPercentageBetween2Number(workingDays, targetDays);
		// 	let percentY: number;
		// 	switch (that.filterStatus.stage) {
		// 		case that.stages[0].key: // Pending Exam
		// 			percentY = that.calPercentageBetween2Number(item.pending_exam, item.capacity);
		// 			break;
		// 		case that.stages[1].key: // Pending Appointment
		// 			percentY = that.calPercentageBetween2Number(item.pending_appointment, item.capacity);
		// 			break;
		// 		case that.stages[2].key: // Pending Interview
		// 			percentY = that.calPercentageBetween2Number(item.pending_interview, item.capacity);
		// 			break;
		// 		case that.stages[3].key: // Pending Sign Contract
		// 			percentY = that.calPercentageBetween2Number(item.pending_sign_contract, item.capacity);
		// 			break;
		// 		case that.stages[4].key: // Onboard
		// 			percentY = that.calPercentageBetween2Number(item.onboard, item.capacity);
		// 			break;
		// 		default:
		// 			percentY = that.calPercentageBetween2Number(item.onboard, item.capacity);
		// 	}

		// 	const color = that.getColorByIndex(index);

		// 	that.bubbleChartData.push({
		// 		data: [
		// 			{ x: percentX, y: percentY, r: item.capacity },
		// 		],
		// 		label: item.position,
		// 		backgroundColor: color,
		// 		pointRadius: 100
		// 	});
		// 	if (maxScaleX < percentX) {
		// 		maxScaleX = percentX;
		// 	}
		// 	if (percentY === 0) {
		// 		minScaleY = -20;
		// 	}
		// 	if (maxScaleY < percentY) {
		// 		maxScaleY = percentY;
		// 	}
		// });

		this.bubbleChartLegend = this.legendLabel;
		this.bubbleChartOptions = {
			responsive: true,
			maintainAspectRatio: true,
			aspectRatio: this.aspectRatio,
			legend: {
				position: this.legendPosition,
			},
			scales: {
				xAxes: [
					{
						ticks: {
							min: 0,
							max: maxScaleX,
						}
					}
				],
				yAxes: [
					{
						ticks: {
							min: minScaleY,
							max: maxScaleY,
						}
					}
				]
			}
		};
		this.filterStatus.departments = this.removeDups(this.filterStatus.departments);
		this.filterStatus.positions = this.removeDups(this.filterStatus.positions);
	}

	// ------------------------------------------------------------------
	// Company Reject Reason
	// ------------------------------------------------------------------

	setChartCompanyReject() {
		let maxScaleX = 0;
		const that = this;
		const rejection = JSON.parse(JSON.stringify(this.rejectionData.rejection));

		// filter data by department
		if (this.filterRejection.department && this.filterRejection.department !== "ALL") {
			rejection.company = rejection.company.filter(function (item) {
				return item.department.name === that.filterRejection.department;
			});
			// set filter position relate with department
			rejection.company.map(function (item) {
				that.filterRejection.positions.push(item.position);
			});
		} else {
			this.rejectionData.rejection.company.map(function (item) {
				that.filterRejection.positions.push(item.position);
			});
		}
		// filter data by position
		if (this.filterRejection.position && this.filterRejection.position !== "ALL") {
			rejection.company = rejection.company.filter(function (item) {
				return item.position === that.filterRejection.position;
			});
		}
		this.filterRejection.departments = this.removeDups(this.filterRejection.departments);
		this.filterRejection.positions = this.removeDups(this.filterRejection.positions);

		this.barChartLabels = [];
		this.barChartData = [];

		let reasonKey = [];
		let arrayTest = [];
		rejection.company.map(function (item) {
			reasonKey.push(item.reason);
		});
		reasonKey.sort();
		reasonKey = this.removeDups(reasonKey);
		reasonKey.map(function (item1) {
			const arrayReason = rejection.company.filter(function (item2) {
				return item2.reason === item1;
			});
			const percent = that.calPercentageBetween2Number(arrayReason.length, rejection.company.length);
			that.barChartLabels.push(item1);
			arrayTest.push(percent);
			if (maxScaleX < percent) {
				maxScaleX = percent;
			}
		});
		// const sum = parseFloat(this.barChartData.reduce((a, b) => a + b).toFixed(1));
		// if (sum !== 100) {
		// 	const index = this.getLargestNumInArrayIndex(this.barChartData);
		// 	this.barChartData[index] = parseFloat((this.barChartData[index] - (sum - 100)).toFixed(1));
		// }
		that.barChartData.push({ data: arrayTest });
		const colors = [];
		this.barChartLabels.map(function (item, index) {
			const color = that.getColorByIndex(index);
			colors.push(color);
		});
		this.barChartColors = [
			{ backgroundColor: colors }
		];
		this.barChartOptions = {
			responsive: true,
			scales: {
				xAxes: [
					{
						ticks: {
							min: 0,
							max: maxScaleX + 10,
						}
					}
				], yAxes: [{}]
			},
			plugins: {
				datalabels: {
					anchor: 'end',
					align: 'end',
				}
			}
			// plugins: {
			// 	datalabels: {
			// 		formatter: (value, ctx) => {
			// 			const label = ctx.chart.data.labels[ctx.dataIndex];
			// 			return label;
			// 		},
			// 	},
			// }
		};
		// this.barChartLegend = this.legendLabel;
		// this.barChartOptions.legend.position = this.legendPosition;
		// this.barChartOptions.aspectRatio = this.aspectRatio;
	}

	// ------------------------------------------------------------------
	// Candidate Reject Reason
	// ------------------------------------------------------------------

	setChartCandidateReject() {
		const that = this;
		let maxScaleX = 0;
		const rejection = JSON.parse(JSON.stringify(this.rejectionData.rejection));

		// filter data by department
		if (this.filterRejection.department && this.filterRejection.department !== "ALL") {
			rejection.candidate = rejection.candidate.filter(function (item) {
				return item.department.name === that.filterRejection.department;
			});
			// set filter position relate with department
			rejection.candidate.map(function (item) {
				that.filterRejection.positions.push(item.position);
			});
		} else {
			this.rejectionData.rejection.candidate.map(function (item) {
				that.filterRejection.positions.push(item.position);
			});
		}
		// filter data by position
		if (this.filterRejection.position && this.filterRejection.position !== "ALL") {
			rejection.candidate = rejection.candidate.filter(function (item) {
				return item.position === that.filterRejection.position;
			});
		}
		this.filterRejection.departments = this.removeDups(this.filterRejection.departments);
		this.filterRejection.positions = this.removeDups(this.filterRejection.positions);

		this.barChart2Labels = [];
		this.barChart2Data = [];
		let reasonKey = [];
		let arrayTest2 = [];
		rejection.candidate.map(function (item) {
			reasonKey.push(item.reason);
		});
		reasonKey.sort();
		reasonKey = this.removeDups(reasonKey);
		reasonKey.map(function (item1) {
			const arrayReason = rejection.candidate.filter(function (item2) {
				return item2.reason === item1;
			});
			const percent = that.calPercentageBetween2Number(arrayReason.length, rejection.candidate.length);
			that.barChart2Labels.push(item1);
			arrayTest2.push(percent);
			if (maxScaleX < percent) {
				maxScaleX = percent;
			}
		});
		that.barChart2Data.push({
			data: arrayTest2
		})
		// const sum = parseFloat(this.barChart2Data.reduce((a, b) => a + b).toFixed(1));
		// if (sum !== 100) {
		// 	const index = this.getLargestNumInArrayIndex(this.barChart2Data);
		// 	this.barChart2Data[index] = parseFloat((this.barChart2Data[index] - (sum - 100)).toFixed(1));
		// }

		const colors = [];
		this.barChart2Labels.map(function (item, index) {
			const color = that.getColorByIndex(index);
			colors.push(color);
		});
		this.barChart2Colors = [
			{ backgroundColor: colors }
		];
		this.barChart2Options = {
			responsive: true,
			scales: {
				xAxes: [
					{
						ticks: {
							min: 0,
							max: maxScaleX + 10,
						}
					}
				], yAxes: [{}]
			},
			plugins: {
				datalabels: {
					anchor: 'end',
					align: 'end',
				}
			}
			// plugins: {
			// 	datalabels: {
			// 		formatter: (value, ctx) => {
			// 			const label = ctx.chart.data.labels[ctx.dataIndex];
			// 			return label;
			// 		},
			// 	},
			// }
		};
		// this.barChart2Legend = this.legendLabel;
		// this.barChart2Options.legend.position = this.legendPosition;
		// this.barChart2Options.aspectRatio = this.aspectRatio;
	}

	// ------------------------------------------------------------------
	// Filter Recruitment Status Report
	// ------------------------------------------------------------------

	onChangeFilterRecruiteDepartment(value: string) {
		this.filterStatus.department = value;
		this.filterStatus.positions = [];
		this.filterStatus.position = "ALL";
		this.filterStatus.stage = "onboard";
		this.setChartRecruitmentStatus();
	}
	onChangeFilterRecruitePosition(value: string) {
		this.filterStatus.position = value;
		this.filterStatus.stage = "onboard";
		this.setChartRecruitmentStatus();
	}
	onChangeFilterRecruiteStage(value: string) {
		this.filterStatus.stage = value;
		this.setChartRecruitmentStatus();
	}

	// ------------------------------------------------------------------
	// Filter Rejection Report
	// ------------------------------------------------------------------

	onChangeFilterRejectionYear(value: any) {
		this.filterRejection.years = [];
		this.filterRejection.year = value;
		this.filterRejection.departments = [];
		this.filterRejection.department = "ALL";
		this.filterRejection.positions = [];
		this.filterRejection.position = "ALL";

		this.enabledRecruitStatus = false;
		this.enabledRejection = true;

		this.rejection = {
			enabled: this.enabledRejection,
			year: this.filterRejection.year
		};

		this.service.getDashboard(this.enabledRecruitStatus, this.rejection, this.enabledJobboard)
			.subscribe(
				res => this.getDashboardSuccess(res),
				err => this.getDashboardFailed(err)
			);
	}
	onChangeFilterRejectionDepartment(value: string) {
		this.filterRejection.department = value;
		this.filterRejection.positions = [];
		this.filterRejection.position = "ALL";
		this.setChartCompanyReject();
		this.setChartCandidateReject();
	}
	onChangeFilterRejectionPosition(value: string) {
		this.filterStatus.position = value;
		this.setChartCompanyReject();
		this.setChartCandidateReject();
	}

	// ------------------------------------------------------------------
	// Time to Fill
	// ------------------------------------------------------------------

	getTimeToFill(year: string) {
		let thisYear = parseInt(this.thisYear);
		this.timeToFillData = [];
		this.filterTimeToFill.years = [];
		this.filterTimeToFill.year = year;
		this.filterTimeToFill.departments = [];
		this.filterTimeToFill.department = 'ALL';
		this.filterTimeToFill.positions = [];
		this.filterTimeToFill.position = 'ALL';
		this.loadingTimeToFill = true;
		this.service.getLogList(year).subscribe(response => {
			if (response.code === ResponseCode.Success) {
				if (response.data) {
					this.timeToFillData = response.data.filter(element => {
						return element.refStage.order === 103 ||
							element.refStage.order === 202 ||
							element.refStage.order === 402 ||
							element.refStage.order === 501 ||
							element.refStage.order === 601;
					});
					while (thisYear >= this.beginYear) {
						this.filterTimeToFill.years.push(thisYear.toString());
						thisYear--;
					}
					this.timeToFillData.forEach(element => {
						this.filterTimeToFill.departments.push(element.refJR.departmentName || element.refJR.departmentId);
					});
					this.timeToFillData.forEach(element => {
						this.filterTimeToFill.positions.push(element.refJR.refJD.position || element.refJR.refJD);
					});
					this.filterTimeToFill.departments = this.removeDups(this.filterTimeToFill.departments);
					this.filterTimeToFill.positions = this.removeDups(this.filterTimeToFill.positions);
					this.setTimeToFill();
				}
			}
			this.loadingTimeToFill = false;
		});
	}

	setTimeToFill() {
		this.timeToFill = this.initialTimeToFill();

		let data = JSON.parse(JSON.stringify(this.timeToFillData));
		if (this.filterTimeToFill.department && this.filterTimeToFill.department !== 'ALL') {
			data = data.filter(element => {
				return element.refJR.departmentName ?
					element.refJR.departmentName === this.filterTimeToFill.department :
					element.refJR.departmentId === this.filterTimeToFill.department;
			});
		}
		if (this.filterTimeToFill.position && this.filterTimeToFill.position !== 'ALL') {
			data = data.filter(element => {
				return element.refJR.refJD.position ?
					element.refJR.refJD.position === this.filterTimeToFill.position :
					element.refJR.refJD === this.filterTimeToFill.position;
			});
		}

		if (data && data.length) {
			this.filterTimeToFill.positions = [];
			data.forEach(element => {
				this.filterTimeToFill.positions.push(element.refJR.refJD.position || element.refJR.refJD);
			});
			this.filterTimeToFill.positions = this.removeDups(this.filterTimeToFill.positions);

			data.forEach(element => {
				const days = this.getDiffDaysBetween2Date(element.refJR.duration.startDate, element.actionBy.date);

				// Applications
				this.timeToFill.applications.data.push(element);
				this.timeToFill.applications.countPerson++;

				switch (element.refStage.order) {
					case 103: // Screened
						this.timeToFill.screened.data.push(element);
						this.timeToFill.screened.countPerson++;
						this.timeToFill.screened.countDays += days;
						break;

					case 202: // Exam Passed
						this.timeToFill.examPassed.data.push(element);
						this.timeToFill.examPassed.countPerson++;
						this.timeToFill.examPassed.countDays += days;
						break;

					case 402: // Interviewed
						this.timeToFill.interviewed.data.push(element);
						this.timeToFill.interviewed.countPerson++;
						this.timeToFill.interviewed.countDays += days;
						break;

					case 501: // Singed Contract
						this.timeToFill.singedContract.data.push(element);
						this.timeToFill.singedContract.countPerson++;
						this.timeToFill.singedContract.countDays += days;
						break;

					case 601: // Job Started
						this.timeToFill.jobStarted.data.push(element);
						this.timeToFill.jobStarted.countPerson++;
						this.timeToFill.jobStarted.countDays += days;
						break;
				}
			});
			// Calculate Percentage
			this.timeToFill.screened.percent = this.calPercentageBetween2Number(
				this.timeToFill.screened.countPerson, this.timeToFill.applications.countPerson, 2
			);
			this.timeToFill.examPassed.percent = this.calPercentageBetween2Number(
				this.timeToFill.examPassed.countPerson, this.timeToFill.applications.countPerson, 2
			);
			this.timeToFill.interviewed.percent = this.calPercentageBetween2Number(
				this.timeToFill.interviewed.countPerson, this.timeToFill.applications.countPerson, 2
			);
			this.timeToFill.singedContract.percent = this.calPercentageBetween2Number(
				this.timeToFill.singedContract.countPerson, this.timeToFill.applications.countPerson, 2
			);
			this.timeToFill.jobStarted.percent = this.calPercentageBetween2Number(
				this.timeToFill.jobStarted.countPerson, this.timeToFill.applications.countPerson, 2
			);

			// Calculate Days
			this.timeToFill.screened.avgDays = parseFloat(
				(this.timeToFill.screened.countDays / this.timeToFill.screened.countPerson).toFixed(2)
			) || 0;
			this.timeToFill.examPassed.avgDays = parseFloat(
				(this.timeToFill.examPassed.countDays / this.timeToFill.examPassed.countPerson).toFixed(2)
			) || 0;
			this.timeToFill.interviewed.avgDays = parseFloat(
				(this.timeToFill.interviewed.countDays / this.timeToFill.interviewed.countPerson).toFixed(2)
			) || 0;
			this.timeToFill.singedContract.avgDays = parseFloat(
				(this.timeToFill.singedContract.countDays / this.timeToFill.singedContract.countPerson).toFixed(2)
			) || 0;
			this.timeToFill.jobStarted.avgDays = parseFloat(
				(this.timeToFill.jobStarted.countDays / this.timeToFill.jobStarted.countPerson).toFixed(2)
			) || 0;
		}
	}

	onChangeFilterTimeToFillYear(year: string) {
		this.getTimeToFill(year);
	}

	onChangeFilterTimeToFillDepartment(value: string) {
		this.filterTimeToFill.department = value;
		this.filterTimeToFill.positions = [];
		this.filterTimeToFill.position = "ALL";
		this.setTimeToFill();
	}

	onChangeFilterTimeToFillPosition(value: string) {
		this.filterStatus.position = value;
		this.setTimeToFill();
	}

	// ------------------------------------------------------------------
	// Helper
	// ------------------------------------------------------------------

	getDiffDaysBetween2Date(date1: Date, date2: Date): number {
		const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
		date1 = new Date(date1);
		date2 = new Date(date2);
		const firstDate = new Date(date1.getFullYear(), date1.getMonth() - 1, date1.getDate());
		const secondDate = new Date(date2.getFullYear(), date2.getMonth() - 1, date2.getDate());

		const diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
		return diffDays;
	}
	calPercentageBetween2Number(num1: number, num2: number, digit = 1): number {
		let percent: number;
		percent = 0;
		if (num2 > 0) {
			// percent = parseInt((num1 / num2 * 100).toFixed(1));
			percent = parseFloat((num1 / num2 * 100).toFixed(digit));
		}
		return percent;
	}
	getColorByIndex(index: number): string {
		const leng = this.backgroundColor.length;
		if (index >= leng) {
			return this.getRandomColor();
		} else {
			return this.backgroundColor[index];
		}
		// while (index >= leng) {
		// 	index -= leng;
		// }
		// return this.backgroundColor[index];
	}
	convertDateReport(date: Date): string {
		date = new Date()
		const monthNames = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"
		];
		const day = date.getDate().toString();
		const month = monthNames[date.getMonth()];
		const year = date.getFullYear().toString();

		return day + " " + month + " " + year;
	}
	removeDups(array: any) {
		const unique = {};
		array.forEach(function (i) {
			if (!unique[i]) {
				unique[i] = true;
			}
		});
		return Object.keys(unique);
	}
	getLargestNumInArrayIndex(array) {
		return array.indexOf(Math.max.apply(Math, array));
	}
	getRandomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

}
