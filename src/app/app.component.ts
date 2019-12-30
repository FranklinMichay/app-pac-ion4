import { BackgroundMode } from '@ionic-native/background-mode/ngx';

import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';


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
    private appMinimize: AppMinimize
  ) {
    this.initializeApp();
    
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.backgroundMode.enable();
      this.backgroundMode.setDefaults({ silent: true });
      this.backgroundMode.disableWebViewOptimizations();
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
