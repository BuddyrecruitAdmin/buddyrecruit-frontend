import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeModule } from '../@theme/theme.module';
import { ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import {
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
  NbSpinnerModule,
  NbUserModule,
  NbTabsetModule,
  NbToastrModule,
  NbTooltipModule,
  NbTreeGridModule,
  NbDialogModule,
  NbWindowModule,
  NbAccordionModule,
  NbProgressBarModule,
  NbChatModule,
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
// import { NbMomentDateModule } from '@nebular/moment';
// import { NbDateFnsDateModule } from '@nebular/date-fns';

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
import { ChartModule } from 'angular2-chartjs';
import { ChartsModule } from 'ng2-charts';
import { TagInputModule } from 'ngx-chips';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { PopupMessageComponent } from './popup-message/popup-message.component';
import { PopupCommentComponent } from './popup-comment/popup-comment.component';
import { PopupJrInfoComponent } from './popup-jr-info/popup-jr-info.component';
import { PopupRejectComponent } from './popup-reject/popup-reject.component';
import { PopupExamDateComponent } from './popup-exam-date/popup-exam-date.component';
import { PopupExamInfoComponent } from './popup-exam-info/popup-exam-info.component';
import { PopupExamScoreComponent } from './popup-exam-score/popup-exam-score.component';
import { PopupEvaluationComponent } from './popup-evaluation/popup-evaluation.component';
import { PopupCvComponent } from './popup-cv/popup-cv.component';
import { PopupPreviewEmailComponent } from './popup-preview-email/popup-preview-email.component';
import { PopupResendEmailComponent } from './popup-resend-email/popup-resend-email.component';
import { PopupInterviewDateComponent } from './popup-interview-date/popup-interview-date.component';
import { PopupSignContractComponent } from './popup-sign-contract/popup-sign-contract.component';
import { PopupAvailableDateComponent } from './popup-available-date/popup-available-date.component';
import { PopupSignDateComponent } from './popup-sign-date/popup-sign-date.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ThemeModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,

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
    NbSpinnerModule,
    NbUserModule,
    NbTabsetModule,
    NbToastrModule,
    NbTooltipModule,
    NbTreeGridModule,
    Ng2SmartTableModule,
    NbDialogModule.forChild(),
    NbWindowModule.forChild(),
    NbAccordionModule,
    NbProgressBarModule,
    NbChatModule,
    // NbMomentDateModule,
    // NbDateFnsDateModule.forChild({ format: 'dd/MM/yyyy' }),

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
    ChartModule,
    ChartsModule,
    TagInputModule,
    AngularEditorModule,
  ],
  declarations: [
    PopupMessageComponent,
    PopupCommentComponent,
    PopupJrInfoComponent,
    PopupRejectComponent,
    PopupExamDateComponent,
    PopupExamInfoComponent,
    PopupExamScoreComponent,
    PopupEvaluationComponent,
    PopupCvComponent,
    PopupPreviewEmailComponent,
    PopupResendEmailComponent,
    PopupInterviewDateComponent,
    PopupSignContractComponent,
    PopupAvailableDateComponent,
    PopupSignDateComponent,
  ],
  exports: [
    PopupMessageComponent,
    PopupCommentComponent,
    PopupJrInfoComponent,
    PopupRejectComponent,
    PopupExamDateComponent,
    PopupExamInfoComponent,
    PopupExamScoreComponent,
    PopupEvaluationComponent,
    PopupCvComponent,
    PopupPreviewEmailComponent,
    PopupResendEmailComponent,
    PopupInterviewDateComponent,
    PopupSignContractComponent,
    PopupAvailableDateComponent,
    PopupSignDateComponent,
  ],
  entryComponents: [
    PopupMessageComponent,
    PopupCommentComponent,
    PopupJrInfoComponent,
    PopupRejectComponent,
    PopupExamDateComponent,
    PopupExamInfoComponent,
    PopupExamScoreComponent,
    PopupEvaluationComponent,
    PopupCvComponent,
    PopupPreviewEmailComponent,
    PopupResendEmailComponent,
    PopupInterviewDateComponent,
    PopupSignContractComponent,
    PopupAvailableDateComponent,
    PopupSignDateComponent,
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

export class ComponentsModule {
  static forRoot() {
    return {
      ngModule: ComponentsModule
    };
  }
}
