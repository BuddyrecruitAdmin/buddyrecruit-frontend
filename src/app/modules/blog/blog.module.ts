import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogComponent } from './blog.component';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { BlogListComponent } from './blog-list/blog-list.component';
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
import { FileUploadModule } from 'ng2-file-upload';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from '../../component/component.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
@NgModule({
  imports: [
    BlogRoutingModule,
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
    NbSpinnerModule,
    DigitOnlyModule,
    FileUploadModule,
    NgbModule,
    AngularEditorModule
  ],
  declarations: [
    BlogListComponent,
    BlogComponent,
    BlogDetailComponent,
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
export class BlogModule {
}
