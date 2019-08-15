import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';
import { ComponentsModule } from '../../component/component.module';
import { SettingRoutingModule } from './setting-routing.module';

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
  NbWindowModule
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

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
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { SettingComponent } from './setting.component';
import { CompanyListComponent } from './company/company-list/company-list.component';
import { CompanyTypeComponent } from './company-type/company-type.component';
import { CompanyDetailComponent } from './company/company-detail/company-detail.component';
import { DepartmentComponent } from './department/department.component';
import { JobPositionComponent } from './job-position/job-position.component';
import { LocationComponent } from './location/location.component';
import { MailTemplateComponent } from './mail-template/mail-template.component';
import { RejectionComponent } from './rejection/rejection.component';
import { ReportComponent } from './report/report.component';
import { UserComponent } from './user/user.component';

@NgModule({
  declarations: [
    SettingComponent,
    CompanyListComponent,
    CompanyTypeComponent,
    CompanyDetailComponent,
    DepartmentComponent,
    JobPositionComponent,
    LocationComponent,
    MailTemplateComponent,
    RejectionComponent,
    ReportComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ThemeModule,
    ComponentsModule,
    SettingRoutingModule,

    A11yModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    ScrollingModule,
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
    NbWindowModule.forChild()
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'en-GB'
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'en-GB'
    },
  ]
})
export class SettingModule { }
