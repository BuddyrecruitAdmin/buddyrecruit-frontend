import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationFormComponent } from './application-form.component';
import { ApplicationFormRoutingModule } from './application-form-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
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
  NbTooltipModule,
  NbSpinnerModule,
  NbStepperModule,
  NbDatepickerModule
} from '@nebular/theme';
import { TranslateService } from '../../translate.service';
export function setupTranslateFactory(
  service: TranslateService): Function {
  return () => service.use('en');
}
import { TranslatePipe } from '../../translate.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { DigitOnlyModule } from '@uiowa/digit-only';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatRadioModule,
  MatSelectModule,
  MatStepperModule,
  MatTableModule,
  MAT_DATE_LOCALE
} from '@angular/material'
import { ApplicationComponent } from './application.component';
import { ApplicationFormIndexComponent } from './application-form-index/application-form-index/application-form-index.component';
import { ApplicationFormStatusComponent } from './application-form-status/application-form-status/application-form-status.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { FileUploadModule } from 'ng2-file-upload';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from '../../component/component.module';
@NgModule({
  imports: [
    ApplicationFormRoutingModule,
    CommonModule,
    ComponentsModule,
    ThemeModule,
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    NbCheckboxModule,
    NbButtonModule,
    NbInputModule,
    NbSelectModule,
    NbTooltipModule,
    NbUserModule,
    NbActionsModule,
    NbRadioModule,
    NbListModule,
    NbIconModule,
    NbDialogModule.forChild(),
    NbWindowModule.forChild(),
    NbToastrModule.forRoot(),
    NbStepperModule,
    NbDatepickerModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSelectModule,
    MatStepperModule,
    MatTableModule,
    TranslateModule.forRoot(),
    NbSpinnerModule,
    DigitOnlyModule,
    MatSelectFilterModule,
    FileUploadModule,
    NgbModule
  ],
  declarations: [
    ApplicationComponent,
    ApplicationFormComponent,
    ApplicationFormIndexComponent,
    ApplicationFormStatusComponent,
    TranslatePipe,
  ],
  providers: [
    TranslateService, 
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
export class ApplicationFormModule {
}
