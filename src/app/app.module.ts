
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, LOCALE_ID } from '@angular/core';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
const config: SocketIoConfig = { url: environment.socketUrl };
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ModalAcceptPostponedPage } from 'src/pages/modal-accept-postponed/modal-accept-postponed.page';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { SearchFilterPage } from './../pages/search-filter/search-filter.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Network } from '@ionic-native/network/ngx';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
registerLocaleData(localeEsAr);


@NgModule({
  declarations: [
    AppComponent,
    GetMeetingPage,
    ModalCancelPage,
    SearchFilterPage,
    ModalAcceptPostponedPage,
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
  ],

  providers: [
    StatusBar,
    ImagePicker,
    SplashScreen,
    BackgroundMode,
    Geolocation,
    AndroidFullScreen,
    AndroidPermissions,
    LocationAccuracy,
    LocalNotifications,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FileTransfer,
    FileTransferObject,
    WebView,
    Network,
    { provide: LOCALE_ID, useValue: 'es-Ar' },
    
  ],

  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA]
})
export class AppModule { }
