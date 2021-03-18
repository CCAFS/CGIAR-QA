import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TypeaheadModule } from 'ngx-type-ahead';
import { NgxSpinnerModule } from "ngx-spinner";
import { MarkdownModule } from 'ngx-markdown';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ErrorComponent } from './error/404.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AlertComponent } from './_shared/alert/alert.component';
import { HeaderBarComponent } from './_shared/header-bar/header-bar.component';

import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
// import { CommentComponent } from './comment/comment.component';
// import { FakeBackendInterceptor } from './_helpers/fake-back';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FilterByRolePipe } from './pipes/filter-by-role.pipe';
import { QaCloseComponent } from './qa-close/qa-close.component';
import { TawkToComponent } from './tawk-to/tawk-to.component';
import { CommentComponentModule } from './comment/comment.module';
import { SafeUrlPipe } from './pipes/safe-url.pipe';

// import { CrpComponent } from './crp/crp.component';

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    LoginComponent,
    AlertComponent,
    AdminComponent,
    FilterByRolePipe,
    HeaderBarComponent,
    QaCloseComponent,
    TawkToComponent,
    SafeUrlPipe
    // CustomFilterPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    ButtonsModule.forRoot(),
    MarkdownModule.forRoot(),
    TypeaheadModule,
    NgxSpinnerModule,
    CommonModule,
    CommentComponentModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
