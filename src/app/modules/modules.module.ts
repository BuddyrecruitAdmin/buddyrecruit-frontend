import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModulesRoutingModule } from './modules-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbAccordionModule,
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbUserModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
  NbInputModule,
  NbToastrModule,
  NbCheckboxModule,
  NbDialogModule,
  NbWindowModule,
  NbPopoverModule,
  NbTooltipModule,
  NbDatepickerModule,
  NbSpinnerModule,
  NbLayoutModule
} from '@nebular/theme';
import { TranslateService } from '../translate.service';
export function setupTranslateFactory(
  service: TranslateService): Function {
  return () => service.use('en');
}
import { TranslatePipe } from '../translate.pipe';
import { NgxEchartsModule } from 'ngx-echarts';
import { TranslateModule } from '@ngx-translate/core';
import { DigitOnlyModule } from '@uiowa/digit-only';

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
  MAT_DATE_LOCALE,
} from '@angular/material';

import {
  NgbModule,
  NgbCarouselModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbButtonsModule
} from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';

import { ModulesComponent } from './modules.component';
import { ComponentsModule } from '../component/component.module';
import { IndexComponent } from './index/index.component';
import { AppFormComponent } from './app-form/app-form.component';
import { ExamFormComponent } from './exam-form/exam-form.component';
import { ResumeComponent } from './resume/resume.component';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CountdownTimerModule } from 'ngx-countdown-timer';
import { ApplicationFormComponent } from './application-form/application-form.component';
import { HomeComponent } from './home/home.component';
import { FeaturesComponent } from './features/features.component';
import { BlogListComponent } from './blog/blog-list/blog-list.component';
import { BlogDetailComponent } from './blog/blog-detail/blog-detail.component';
import { PdpaComponent } from './pdpa/pdpa.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ApplicationFormIndexComponent } from './application-form/application-form-index/application-form-index/application-form-index.component';
import { ApplicationFormStatusComponent } from './application-form/application-form-status/application-form-status/application-form-status.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    ComponentsModule,
    ModulesRoutingModule,

    ThemeModule,
    NbCardModule,
    NbCheckboxModule,
    NbTabsetModule,
    NbPopoverModule,
    NbButtonModule,
    NbInputModule,
    NbSelectModule,
    NbSpinnerModule,
    NbTooltipModule,
    NbUserModule,
    NbAccordionModule,
    NbActionsModule,
    NbRadioModule,
    NbListModule,
    NbIconModule,
    NbDialogModule.forChild(),
    NbWindowModule.forChild(),
    NbToastrModule.forRoot(),
    NgxEchartsModule,
    NbDatepickerModule,
    NbLayoutModule,

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

    TranslateModule.forRoot(),
    DigitOnlyModule,

    NgbModule,
    NgbCarouselModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbButtonsModule,
    CountdownTimerModule.forRoot(),
    FileUploadModule,
    HttpClientModule,
    AngularEditorModule
  ],
  declarations: [
    ModulesComponent,
    TranslatePipe,
    IndexComponent,
    AppFormComponent,
    ExamFormComponent,
    ResumeComponent,
    ApplicationFormComponent,
    HomeComponent,
    FeaturesComponent,
    BlogDetailComponent,
    BlogListComponent,
    PdpaComponent,
    ApplicationFormIndexComponent,
    ApplicationFormStatusComponent
  ],
  providers: [
    TranslateService,
    NgbModalConfig, NgbModal,
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateFactory,
      deps: [
        TranslateService
      ],
      multi: true
    },
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
export class ModulesModule {
}
