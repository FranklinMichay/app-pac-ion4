
import { NgModule } from '@angular/core';
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

const config: SocketIoConfig = {url: environment.socketUrl};

@NgModule({
  declarations: [
    AppComponent,
    GetMeetingPage,
    ModalCancelPage
    
  ],
  entryComponents: [
    GetMeetingPage,
    ModalCancelPage
    
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment),
    HttpClientModule,
    CalendarModule,
    SocketIoModule.forRoot(config)
  ],
  
  providers: [
    StatusBar,
    SplashScreen,
    
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
