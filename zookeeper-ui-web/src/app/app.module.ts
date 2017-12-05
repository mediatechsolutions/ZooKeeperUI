import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, Http, RequestOptions, XHRBackend } from  '@angular/http';
import { routing } from './app.routing';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FocusModule } from 'angular2-focus';
import { NgUploaderModule } from 'ngx-uploader';

import { AppComponent } from './app.component';
import { NodesPageComponent } from './components/nodes-page/nodes-page.component';

import { ConfigApi } from './autogenerated/api/ConfigApi';
import { SessionsApi } from './autogenerated/api/SessionsApi';
import { BASE_PATH } from './autogenerated/variables';
import { Configuration } from './autogenerated/configuration';

import { properties } from '../assets/properties';
import { NodeCreationModalComponent } from './components/node-creation-modal/node-creation-modal.component';
import { NodeComponent } from './components/node/node.component';
import { FileUploadModalComponent } from './components/file-upload-modal/file-upload-modal.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { LoginComponent } from './components/login/login.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { HttpInterceptor } from './services/http-interceptor.service';
import { Router } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    NodesPageComponent,
    NodeCreationModalComponent,
    NodeComponent,
    FileUploadModalComponent,
    AlertsComponent,
    LoginComponent,
    LoadingSpinnerComponent
  ],
  entryComponents: [NodeCreationModalComponent, FileUploadModalComponent],
  imports: [
    BrowserModule,
    routing,
    HttpModule,
    FormsModule,
    ModalModule.forRoot(),
    FocusModule.forRoot(),
    NgUploaderModule
  ],
  providers: [
    ConfigApi,
    SessionsApi,
    { provide: BASE_PATH, useValue: properties.zooKeeperServiceBaseUrl },
    { provide: Configuration, useValue: { withCredentials: true } },
    { provide: Http, useFactory: httpFactory, deps: [XHRBackend, RequestOptions, Router] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function httpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions, router: Router) {
    return new HttpInterceptor(xhrBackend, requestOptions, router);
}
