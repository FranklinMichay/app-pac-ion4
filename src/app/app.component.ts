import { BackgroundMode } from '@ionic-native/background-mode/ngx';

import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';
// import { AppMinimize } from '@ionic-native/app-minimize/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],

})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private backgroundMode: BackgroundMode,
    private fcm: FCM,
  ) {
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.backgroundMode.enable();
      // this.backgroundMode.on('enable').subscribe(() => {
      //   console.log('enabled')
      // });
      // this.backgroundMode.on('activate').subscribe(() => {
      //   console.log('activated')
      // })
      this.backgroundMode.disableWebViewOptimizations();

      // this.fcm.getToken().then(token => {
      //   console.log(token, 'FIREBASE');
      // });

      // this.fcm.onTokenRefresh().subscribe(token => {
      //   console.log(token);
      // });

      // this.fcm.onNotification().subscribe(data => {
      //   console.log(data);
      //   if (data.wasTapped) {
      //     console.log('Received in background');
      //     this.router.navigate([data.landing_page, data.price]);
      //   } else {
      //     console.log('Received in foreground');
      //     this.router.navigate([data.landing_page, data.price]);
      //   }
      // });
      // this.fcm.subscribeToTopic('people');
      // this.fcm.unsubscribeFromTopic('marketing');
    });



    this.platform.backButton.subscribe(() => {
      this.backgroundMode.overrideBackButton();
      if (window.location.pathname === "/home" || window.location.pathname === "/login") {
        this.backgroundMode.moveToBackground();
        this.backgroundMode.overrideBackButton();
        navigator['app'].exitApp();
      }
    });
  }
}
