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
import { CalendarModule } from 'ion2-calendar';
import { GetMeetingPage } from './../pages/get-meeting/get-meeting.page';
import { ModalCancelPage } from './../pages/modal-cancel/modal-cancel.page';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TagInputModule } from 'ngx-chips';


const config: SocketIoConfig = { url: environment.socketUrl };

@NgModule({
  declarations: [
    AppComponent,
    GetMeetingPage,
    ModalCancelPage,
    SearchFilterPage
  ],
  entryComponents: [
    GetMeetingPage,
    ModalCancelPage,
    SearchFilterPage
  ],
  imports: [
    BrowserModule,    
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment),
    HttpClientModule,
    CalendarModule,
    SocketIoModule.forRoot(config),
    AutoCompleteModule,
    TagInputModule,
  ],

  providers: [
    StatusBar,
    SplashScreen,

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA]
})
export class AppModule { }
