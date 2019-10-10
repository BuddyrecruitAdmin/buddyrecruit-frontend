import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DashboardComponent } from './dashboard.component';
import { ChartModule } from 'angular2-chartjs';
import { ChartsModule } from 'ng2-charts';

import {
	MatButtonModule,
	MatButtonToggleModule,
	MatProgressSpinnerModule
} from '@angular/material';
import {
	NbSpinnerModule,
	NbCardModule,
	NbAccordionModule,
	NbButtonModule,
	NbIconModule,
	NbInputModule,
	NbSelectModule
} from '@nebular/theme';
const routes: Routes = [{
	path: '',
	data: {
		title: 'Dashboard',
		urls: [{ title: 'Dashboard', url: '/dashboard' }]
	},
	component: DashboardComponent
}];

@NgModule({
	imports: [
		FormsModule,
		CommonModule,
		RouterModule.forChild(routes),
		ChartModule,
		ChartsModule,
		NgbModule,
		MatButtonModule,
		MatButtonToggleModule,
		NbSpinnerModule,
		MatProgressSpinnerModule,
		NbCardModule,
		NbAccordionModule,
		NbButtonModule,
		NbIconModule,
		NbInputModule,
		NbSelectModule
	],
	declarations: [DashboardComponent]
})
export class DashboardModule { }
