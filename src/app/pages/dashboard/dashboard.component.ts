import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MESSAGE } from "../../shared/constants/message";
import { DomSanitizer, SafeResourceUrl, } from '@angular/platform-browser';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import * as Chart from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { DashboardService } from './dashboard.service';

@Component({
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	thisYear = new Date().getFullYear();
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

	rejection = {
		enabled: false,
		year: this.thisYear
	};

	enabledRecruitStatus: boolean;
	enabledRejection: boolean;

	recruiteData: any;
	rejectionData: any;

	reportDate: string;

	legendLabel: any;
	legendPosition: any;
	aspectRatio: any;

	loading = true;

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
	public pieChart1Legend = true;
	public pieChart1Type: ChartType = 'doughnut';
	public pieChart1Options: ChartOptions = {
		responsive: true,
		aspectRatio: 1,
		legend: {
			position: 'right',
		},
		// plugins: {
		// 	datalabels: {
		// 		formatter: (value, ctx) => {
		// 			const label = ctx.chart.data.labels[ctx.dataIndex];
		// 			return label;
		// 		},
		// 	},
		// }
	};
	public pieChart1Labels: Label[] = [];
	public pieChart1Data: number[] = [];
	public pieChart1Plugins = [pluginDataLabels];
	public pieChart1Colors: Color[] = [
		{ backgroundColor: this.backgroundColor }
	];

	// Candidate Reject Reason
	public pieChart2Legend = true;
	public pieChart2Type: ChartType = 'doughnut';
	public pieChart2Options: ChartOptions = {
		responsive: true,
		aspectRatio: 1,
		legend: {
			position: 'right',
		},
		// plugins: {
		// 	datalabels: {
		// 		formatter: (value, ctx) => {
		// 			const label = ctx.chart.data.labels[ctx.dataIndex];
		// 			return label;
		// 		},
		// 	},
		// }
	};
	public pieChart2Labels: Label[] = [];
	public pieChart2Data: number[] = [];
	public pieChart2Plugins = [pluginDataLabels];
	public pieChart2Colors: Color[] = [
		{ backgroundColor: this.backgroundColor }
	];

	constructor(
		private router: Router,
		private service: DashboardService,
		public sanitizer: DomSanitizer
	) {
	}

	ngOnInit() {
		if (window.innerWidth <= 414) { // iphone 6/7/8 plus
			this.legendPosition = "top";
			this.legendLabel = false;
			this.aspectRatio = 1;
		} else {
			this.legendPosition = "right";
			this.legendLabel = true;
			this.aspectRatio = 2;
		}
		this.getDashboard();
	}

	// ------------------------------------------------------------------
	// Get Dashboard
	// ------------------------------------------------------------------

	getDashboard() {
		this.enabledRecruitStatus = true;
		this.enabledRejection = true;

		this.rejection = {
			enabled: this.enabledRejection,
			year: this.thisYear
		};

		this.service.getDashboard(this.enabledRecruitStatus, this.rejection)
			.subscribe(response => {
				// res => this.getDashboardSuccess(res),
				// err => this.getDashboardFailed(err)
				this.getDashboardSuccess(response);
			});
	}
	getDashboardSuccess(res: any) {
		const that = this;
		let thisYear = this.thisYear;

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
		}
		this.loading = false;
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
		reasonKey.map(function (item1, index) {
			const item = data.recruitmentStatus.find(function (item2) {
				return item2.position === item1;
			});

			const startDate = new Date(item.duration.start_date);
			const endDate = new Date(item.onboard_date);

			const workingDays = that.getDiffDaysBetween2Date(startDate, today);
			const targetDays = that.getDiffDaysBetween2Date(startDate, endDate);

			const percentX = that.calPercentageBetween2Number(workingDays, targetDays);
			let percentY: number;
			switch (that.filterStatus.stage) {
				case that.stages[0].key: // Pending Exam
					percentY = that.calPercentageBetween2Number(item.pending_exam, item.capacity);
					break;
				case that.stages[1].key: // Pending Appointment
					percentY = that.calPercentageBetween2Number(item.pending_appointment, item.capacity);
					break;
				case that.stages[2].key: // Pending Interview
					percentY = that.calPercentageBetween2Number(item.pending_interview, item.capacity);
					break;
				case that.stages[3].key: // Pending Sign Contract
					percentY = that.calPercentageBetween2Number(item.pending_sign_contract, item.capacity);
					break;
				case that.stages[4].key: // Onboard
					percentY = that.calPercentageBetween2Number(item.onboard, item.capacity);
					break;
				default:
					percentY = that.calPercentageBetween2Number(item.onboard, item.capacity);
			}

			const color = that.getColorByIndex(index);

			that.bubbleChartData.push({
				data: [
					{ x: percentX, y: percentY, r: item.capacity },
				],
				label: item.position,
				backgroundColor: color,
				pointRadius: 100
			});
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

		this.pieChart1Labels = [];
		this.pieChart1Data = [];

		let reasonKey = [];
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
			that.pieChart1Labels.push(item1);
			that.pieChart1Data.push(percent);
		});
		const sum = parseFloat(this.pieChart1Data.reduce((a, b) => a + b).toFixed(1));
		if (sum !== 100) {
			const index = this.getLargestNumInArrayIndex(this.pieChart1Data);
			this.pieChart1Data[index] = parseFloat((this.pieChart1Data[index] - (sum - 100)).toFixed(1));
		}

		const colors = [];
		this.pieChart1Labels.map(function (item, index) {
			const color = that.getColorByIndex(index);
			colors.push(color);
		});
		this.pieChart1Colors = [
			{ backgroundColor: colors }
		];
		this.pieChart1Legend = this.legendLabel;
		this.pieChart1Options.legend.position = this.legendPosition;
		this.pieChart1Options.aspectRatio = this.aspectRatio;
	}

	// ------------------------------------------------------------------
	// Candidate Reject Reason
	// ------------------------------------------------------------------

	setChartCandidateReject() {
		const that = this;
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

		this.pieChart2Labels = [];
		this.pieChart2Data = [];
		let reasonKey = [];
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
			that.pieChart2Labels.push(item1);
			that.pieChart2Data.push(percent);
		});
		const sum = parseFloat(this.pieChart2Data.reduce((a, b) => a + b).toFixed(1));
		if (sum !== 100) {
			const index = this.getLargestNumInArrayIndex(this.pieChart2Data);
			this.pieChart2Data[index] = parseFloat((this.pieChart2Data[index] - (sum - 100)).toFixed(1));
		}

		const colors = [];
		this.pieChart1Labels.map(function (item, index) {
			const color = that.getColorByIndex(index);
			colors.push(color);
		});
		this.pieChart1Colors = [
			{ backgroundColor: colors }
		];
		this.pieChart2Legend = this.legendLabel;
		this.pieChart2Options.legend.position = this.legendPosition;
		this.pieChart2Options.aspectRatio = this.aspectRatio;
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

	onChangeFilterRejectionYear(value: number) {
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

		this.service.getDashboard(this.enabledRecruitStatus, this.rejection)
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
	// Helper
	// ------------------------------------------------------------------

	getDiffDaysBetween2Date(date1: Date, date2: Date): number {
		const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
		const firstDate = new Date(date1.getFullYear(), date1.getMonth() - 1, date1.getDate());
		const secondDate = new Date(date2.getFullYear(), date2.getMonth() - 1, date2.getDate());

		const diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
		return diffDays;
	}
	calPercentageBetween2Number(num1: number, num2: number): number {
		let percent: number;
		percent = 0;
		if (num2 > 0) {
			// percent = parseInt((num1 / num2 * 100).toFixed(1));
			percent = parseFloat((num1 / num2 * 100).toFixed(1));
		}
		return percent;
	}
	getColorByIndex(index: number): string {
		const leng = this.backgroundColor.length;
		while (index >= leng) {
			index -= leng;
		}
		return this.backgroundColor[index];
	}
	convertDateReport(date: Date): string {
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

}
