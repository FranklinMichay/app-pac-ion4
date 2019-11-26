import { SearchFilterPage } from './../pages/search-filter/search-filter.page';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { GetMeetingPage } from './../pages/get-meeting/get-meeting.page';
import { ModalCancelPage } from './../pages/modal-cancel/modal-cancel.page';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TagInputModule } from 'ngx-chips';
import { Camera } from '@ionic-native/camera/ngx';
import { ImagePicker }  from '@ionic-native/image-picker/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Crop } from '@ionic-native/crop/ngx';
const config: SocketIoConfig = { url: environment.socketUrl };
import { WebView } from '@ionic-native/ionic-webview/ngx';
//import { PrescriptionDetailPage } from 'src/pages/prescription-detail/prescription-detail.page';
import { ModalAcceptPostponedPage } from 'src/pages/modal-accept-postponed/modal-accept-postponed.page';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@NgModule({
  declarations: [
    AppComponent,
    GetMeetingPage,
    ModalCancelPage,
    SearchFilterPage,
    ModalAcceptPostponedPage
  ],
  entryComponents: [
    GetMeetingPage,
    ModalCancelPage,
    SearchFilterPage,
    ModalAcceptPostponedPage
  ],
  imports: [
    BrowserModule,    
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment),
    HttpClientModule,
    SocketIoModule.forRoot(config),
    AutoCompleteModule,
    TagInputModule,
  
  ],

  providers: [
    StatusBar,
    ImagePicker,
    SplashScreen,
    BackgroundMode,
    Camera,
    LocalNotifications,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FileTransfer,
    FileTransferObject,
    Crop,
    WebView,
    //{provide: Camera, useClass: CameraMock},
  ],
  
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA]
})
export class AppModule { }
