/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { GestureConfig } from '@angular/material';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { TagInputModule } from 'ngx-chips';
import { AppRoutingModule } from './app-routing.module';
import { TranslateService } from './translate.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NumberDirective } from "./shared/directive/number.directive";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
export function setupTranslateFactory(
  service: TranslateService): Function {
  return () => service.use('en');
}
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
  NbCardModule,
  NbButtonModule,
  NbTooltipModule,
} from '@nebular/theme';
import { PusherService } from './shared/services/pusher.service';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    NumberDirective
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    TagInputModule,
    ThemeModule.forRoot(),
    TranslateModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    NbCardModule,
    NbButtonModule,
    NbTooltipModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    NbCardModule,
    NbButtonModule,
    NbTooltipModule
  ],
  bootstrap: [AppComponent],
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
    PusherService,
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
  ]
})
export class AppModule {
}
