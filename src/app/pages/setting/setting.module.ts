import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';
import { ComponentsModule } from '../../component/component.module';
import { SettingRoutingModule } from './setting-routing.module';
import { DigitOnlyModule } from '@uiowa/digit-only';
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
  NbSpinnerModule,
  NbUserModule,
  NbTabsetModule,
  NbToastrModule,
  NbTooltipModule,
  NbTreeGridModule,
  NbDialogModule,
  NbWindowModule,
  NbAccordionModule,
  NbAlertModule,
  NbPopoverModule,
  NbBadgeModule
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AngularEditorModule } from '@kolkov/angular-editor';
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
  MatFormFieldModule
} from '@angular/material';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { TagInputModule } from 'ngx-chips';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SettingComponent } from './setting.component';
import { CompanyListComponent } from './company/company-list/company-list.component';
import { CompanyTypeComponent } from './company-type/company-type.component';
import { CompanyDetailComponent } from './company/company-detail/company-detail.component';
import { JobPositionComponent } from './job-position/job-position.component';
import { LocationComponent } from './location/location.component';
import { MailTemplateListComponent } from './mail-template/mail-template-list/mail-template-list.component';
import { MailTemplateDetailComponent } from './mail-template/mail-template-detail/mail-template-detail.component';
import { RejectionComponent } from './rejection/rejection.component';
import { ReportComponent } from './report/report.component';
import { DepartmentListComponent } from './department/department-list/department-list.component';
import { DepartmentDetailComponent } from './department/department-detail/department-detail.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { AuthorizeListComponent } from './authorize/authorize-list/authorize-list.component';
import { AuthorizeDetailComponent } from './authorize/authorize-detail/authorize-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RejectStageComponent } from './reject-stage/reject-stage.component';
import { EvaluationDetailComponent } from './evaluation/evaluation-detail/evaluation-detail.component';
import { EvaluationListComponent } from './evaluation/evaluation-list/evaluation-list.component';
import { BlacklistComponent } from './blacklist/blacklist.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    SettingComponent,
    CompanyListComponent,
    CompanyTypeComponent,
    CompanyDetailComponent,
    JobPositionComponent,
    LocationComponent,
    MailTemplateListComponent,
    MailTemplateDetailComponent,
    RejectionComponent,
    ReportComponent,
    DepartmentListComponent,
    DepartmentDetailComponent,
    UserListComponent,
    UserDetailComponent,
    AuthorizeListComponent,
    AuthorizeDetailComponent,
    DashboardComponent,
    RejectStageComponent,
    EvaluationDetailComponent,
    EvaluationListComponent,
    BlacklistComponent,
    ContactUsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ThemeModule,
    ComponentsModule,
    SettingRoutingModule,
    DigitOnlyModule,
    NbActionsModule,
    NbButtonModule,
    NbCardModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbSpinnerModule,
    NbUserModule,
    NbTabsetModule,
    NbToastrModule,
    NbTooltipModule,
    NbTreeGridModule,
    Ng2SmartTableModule,
    NbDialogModule.forRoot(),
    NbWindowModule.forChild(),
    NbAccordionModule,
    NbAlertModule,
    NbPopoverModule,
    NbBadgeModule,

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

    AngularEditorModule,
    TagInputModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    MatSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    MatSelectFilterModule
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
