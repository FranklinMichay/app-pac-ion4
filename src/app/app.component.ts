import { BackgroundMode } from '@ionic-native/background-mode/ngx';

import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';


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
    
  ) {
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.backgroundMode.enable();
    });

    

    this.platform.backButton.subscribe(() => {
      this.backgroundMode.overrideBackButton();
      if (window.location.pathname === "/home" || window.location.pathname === "/login") {
        this.backgroundMode.moveToBackground();
        this.backgroundMode.overrideBackButton();
        //this.backgroundMode.disable();
        navigator['app'].exitApp();
      }
    });

    
  }

  // <edit-config file="AndroidManifest.xml" mode="merge" target="/manifest/uses-permission" xmlns:android="http://schemas.android.com/apk/res/android">
  //           <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
  //       </edit-config>

  // tartService() {
  //   // Notification importance is optional, the default is 1 - Low (no sound or vibration)
  //   this.foregroundService.start('GPS Running', 'Background Service', 'drawable/fsicon');
  //  }
}
