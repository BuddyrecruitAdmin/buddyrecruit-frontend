import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { JsonpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsRoutes } from './component.routing';
import { HttpClientModule } from '@angular/common/http';
// import { AngularEditorModule } from '@kolkov/angular-editor';
// import { TagInputModule } from "ngx-chips";

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
  NbTooltipModule,
  NbTreeGridModule,
  NbDialogModule
} from '@nebular/theme';

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

// import { CvDetailComponent } from './cv-detail/cv-detail.component';
// import { PaginationComponent } from './pagination/pagination.component';
// import { EmailComponent } from './email/email.component';
import { PopupMessageComponent } from './popup-message/popup-message.component';
// import { PopupRejectComponent } from './popup-reject/popup-reject.component';
// import { PopupDatetimeComponent } from './popup-datetime/popup-datetime.component';
// import { PopupScoreComponent } from './popup-score/popup-score.component';
// import { PopupCommentComponent } from './popup-comment/popup-comment.component';
// import { PopupPositionComponent } from './popup-position/popup-position.component';
// import { PopupCompanyComponent } from './popup-company/popup-company.component';
// import { PopupDepartmentComponent } from './popup-department/popup-department.component';
// import { PopupLocationComponent } from './popup-location/popup-location.component';
// import { PopupUserComponent } from './popup-user/popup-user.component';
// import { PopupReasonRejectComponent } from './popup-reason-reject/popup-reason-reject.component';
// import { PopupSelectJdComponent } from './popup-select-jd/popup-select-jd.component';
// import { PopupCvComponent } from './popup-cv/popup-cv.component';
// import { PopupConfigEmailComponent } from './popup-config-email/popup-config-email.component';
// import { PopupAppointmentComponent } from './popup-appointment/popup-appointment.component';
// import { PopupBugReportComponent } from './popup-bug-report/popup-bug-report.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ComponentsRoutes),
    FormsModule,
    ReactiveFormsModule,
    // JsonpModule,
    NgbModule,
    HttpClientModule,
    // AngularEditorModule,
    // TagInputModule,

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
    NbTooltipModule,
    NbTreeGridModule,

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
    ScrollingModule
  ],
  declarations: [
    // CvDetailComponent,
    // PaginationComponent,
    // EmailComponent,
    PopupMessageComponent,
    // PopupRejectComponent,
    // PopupDatetimeComponent,
    // PopupScoreComponent,
    // PopupCommentComponent,
    // PopupPositionComponent,
    // PopupCompanyComponent,
    // PopupDepartmentComponent,
    // PopupLocationComponent,
    // PopupUserComponent,
    // PopupReasonRejectComponent,
    // PopupSelectJdComponent,
    // PopupCvComponent,
    // PopupConfigEmailComponent,
    // PopupAppointmentComponent,
    // PopupBugReportComponent
  ],
  exports: [
    // CvDetailComponent,
    // PaginationComponent,
    // EmailComponent,
    PopupMessageComponent,
    // PopupRejectComponent,
    // PopupDatetimeComponent,
    // PopupScoreComponent,
    // PopupCommentComponent,
    // PopupPositionComponent,
    // PopupCompanyComponent,
    // PopupDepartmentComponent,
    // PopupLocationComponent,
    // PopupUserComponent,
    // PopupReasonRejectComponent,
    // PopupCvComponent,
    // PopupConfigEmailComponent,
    // PopupAppointmentComponent,
    // PopupBugReportComponent
  ],
  entryComponents: [
    // EmailComponent,
    PopupMessageComponent,
    // PopupRejectComponent,
    // PopupDatetimeComponent,
    // PopupScoreComponent,
    // PopupCommentComponent,
    // PopupPositionComponent,
    // PopupCompanyComponent,
    // PopupDepartmentComponent,
    // PopupLocationComponent,
    // PopupUserComponent,
    // PopupReasonRejectComponent,
    // PopupCvComponent,
    // PopupConfigEmailComponent,
    // PopupAppointmentComponent,
    // PopupBugReportComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ComponentsModule {
  static forRoot() {
    return {
      ngModule: ComponentsModule
    };
  }
}
