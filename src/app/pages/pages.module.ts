import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import {
  CommonModule,
  LocationStrategy,
  PathLocationStrategy
} from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NbMenuModule } from '@nebular/theme';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
  NbToastrModule,
  NbTooltipModule,
  NbTreeGridModule,
  NbDialogModule,
  NbWindowModule,
  NbAccordionModule
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../@theme/theme.module';
import { PagesRoutingModule } from './pages-routing.module';

import { A11yModule } from '@angular/cdk/a11y';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';
import { ChartModule } from 'angular2-chartjs';
import { ChartsModule } from 'ng2-charts';

import { PagesComponent } from './pages.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { JdListComponent } from './jd/jd-list/jd-list.component';
import { JdDetailComponent } from './jd/jd-detail/jd-detail.component';
import { JrListComponent } from './jr/jr-list/jr-list.component';
import { JrDetailComponent } from './jr/jr-detail/jr-detail.component';
import { TalentPoolListComponent } from './talent-pool/talent-pool-list/talent-pool-list.component';
import { TalentPoolDetailComponent } from './talent-pool/talent-pool-detail/talent-pool-detail.component';
import { ExamListComponent } from './exam/exam-list/exam-list.component';
import { ExamDetailComponent } from './exam/exam-detail/exam-detail.component';
import { AppointmentListComponent } from './appointment/appointment-list/appointment-list.component';
import { AppointmentDetailComponent } from './appointment/appointment-detail/appointment-detail.component';
import { InterviewListComponent } from './interview/interview-list/interview-list.component';
import { InterviewDetailComponent } from './interview/interview-detail/interview-detail.component';
import { SignContractListComponent } from './sign-contract/sign-contract-list/sign-contract-list.component';
import { SignContractDetailComponent } from './sign-contract/sign-contract-detail/sign-contract-detail.component';
import { OnboardListComponent } from './onboard/onboard-list/onboard-list.component';
import { OnboardDetailComponent } from './onboard/onboard-detail/onboard-detail.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgbModule,

    ThemeModule,
    NbMenuModule,
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbUserModule,
    NbToastrModule,
    NbTooltipModule,
    NbTreeGridModule,
    Ng2SmartTableModule,
    NbDialogModule.forRoot(),
    NbWindowModule.forChild(),
    NbAccordionModule,

    A11yModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    ScrollingModule,
    ChartModule,
    ChartsModule,
  ],
  declarations: [
    PagesComponent,
    ProfileComponent,
    JdListComponent,
    JdDetailComponent,
    JrListComponent,
    JrDetailComponent,
    TalentPoolListComponent,
    TalentPoolDetailComponent,
    ExamListComponent,
    ExamDetailComponent,
    AppointmentListComponent,
    AppointmentDetailComponent,
    InterviewListComponent,
    InterviewDetailComponent,
    SignContractListComponent,
    SignContractDetailComponent,
    OnboardListComponent,
    OnboardDetailComponent,
  ],
  exports: [
    A11yModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    ScrollingModule,
    ChartModule,
    ChartsModule,
  ]
})
export class PagesModule {
}
