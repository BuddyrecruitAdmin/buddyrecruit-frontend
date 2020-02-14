import { NgModule, APP_INITIALIZER } from '@angular/core';
import { EmployerRoutingModule } from './employer-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
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
  NbSpinnerModule
} from '@nebular/theme';
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
} from '@angular/material'
import { ComponentsModule } from '../../component/component.module';
import { EmployerComponent } from './employer.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';

import { ForgotComponent } from './forgot/forgot.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RegistrationComponent } from './registration/registration.component';

@NgModule({
  imports: [
    EmployerRoutingModule,
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
    NbActionsModule,
    NbRadioModule,
    NbListModule,
    NbIconModule,
    NbDialogModule.forChild(),
    NbWindowModule.forChild(),
    NbToastrModule.forRoot(),
    NgxEchartsModule,
    NbDatepickerModule,
    MatDatepickerModule,
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
    DigitOnlyModule
  ],
  declarations: [
    EmployerComponent,
    LoginComponent,
    LogoutComponent,
    ForgotComponent,
    ChangePasswordComponent,
    RegistrationComponent
  ],
  providers: [
  ]
})
export class EmployerModule {
}
