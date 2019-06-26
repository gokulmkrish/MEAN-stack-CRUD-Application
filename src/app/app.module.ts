import { AuthService } from './_services/auth.service';
import { JwtInterceptor } from './_helper/jwtinterceptors';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SnackbarcompComponent } from './shared/snackbarcomp/snackbarcomp.component';
import { ViewdialogcompComponent } from './shared/viewdialogcomp/viewdialogcomp.component';
import { materialcompModule } from './_material/materialcomp';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    SnackbarcompComponent,
    ViewdialogcompComponent,
  
  ],
  entryComponents: [
    SnackbarcompComponent,
    ViewdialogcompComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    materialcompModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
