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
import { ModulesComponent } from './modules.component';
import { ComponentsModule } from '../component/component.module';
import { IndexComponent } from './index/index.component';
import { AppFormComponent } from './app-form/app-form.component';
import { ExamFormComponent } from './exam-form/exam-form.component';
import { ResumeComponent } from './resume/resume.component';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CountdownTimerModule } from 'ngx-countdown-timer';
@NgModule({
  imports: [
    ModulesRoutingModule,
    CommonModule,
    ThemeModule,
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    NbCheckboxModule,
    NbTabsetModule,
    NbPopoverModule,
    NbButtonModule,
    NbInputModule,
    NbSelectModule,
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
    ComponentsModule,
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
    NbSpinnerModule,
    DigitOnlyModule,

    NgbModule,
    NgbCarouselModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbButtonsModule,
    NbLayoutModule,
    CountdownTimerModule.forRoot()

  ],
  declarations: [
    ModulesComponent,
    TranslatePipe,
    IndexComponent,
    AppFormComponent,
    ExamFormComponent,
    ResumeComponent,
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
