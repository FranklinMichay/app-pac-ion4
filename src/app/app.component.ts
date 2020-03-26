import { log } from 'util';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BackgroundMode } from "@ionic-native/background-mode/ngx";

import { Component } from "@angular/core";

import { Platform, ToastController, AlertController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Router } from "@angular/router";
import { tap } from "rxjs/operators";
import { AuthService } from "src/app/services/auth.service";
import { OneSignal } from "@ionic-native/onesignal/ngx";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"]
})
export class AppComponent {
  httpOptions: any;
  user: any;
  id: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private backgroundMode: BackgroundMode,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private auth: AuthService,
    private oneSignal: OneSignal,
    private alertCtrl: AlertController
  ) {
    this.initializeApp();
    this.user = JSON.parse(localStorage.getItem("userPaciente"));
    if (this.user) {
      this.router.navigateByUrl("/home");
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.backgroundMode.enable();
      this.handlerNotifications();
      // if (this.platform.is("android") || this.platform.is("ios")) {
      //   this.initializeFirebase();
      // }
    });

    this.platform.backButton.subscribe(() => {
      this.backgroundMode.overrideBackButton();
      if (
        window.location.pathname === "/home" ||
        window.location.pathname === "/login"
      ) {
        this.backgroundMode.moveToBackground();
        this.backgroundMode.overrideBackButton();
        //this.backgroundMode.disable();
        navigator["app"].exitApp();
      }
    });
  }

  handlerNotifications() {
    this.oneSignal
      .getIds()
      .then(ids => {
        this.id = ids.userId;
        console.log(this.id, 'id one Signal');
        console.log(this.user.identificacion, 'cedula de paciente');
        
      })
      .catch(err => {
        this.id = "no se pudo obtener el id" + err;
      });
    this.oneSignal.startInit(
      "f5f12413-6bdd-4f49-a6df-9447e5e3979a",
      "250027133090"
    );
    this.oneSignal.inFocusDisplaying(
      this.oneSignal.OSInFocusDisplayOption.Notification
    );
    this.oneSignal.handleNotificationOpened().subscribe(jsonData => {
      this.presentAlert(jsonData);
      console.log("notificationOpenedCallback: " + JSON.stringify(jsonData));
    });
    this.oneSignal.endInit();
  }

  async presentAlert(jsonData) {
    const alert = await this.alertCtrl.create({
      header: jsonData.notification.payload.title,
      subHeader: "ALERTA MEDIPHARM",
      message: jsonData.notification.payload.body,
      buttons: ["OK"]
    });

    await alert.present();
  }

  // function(){
  //   $http({
  //   method: "POST",
  //   url: "https://onesignal.com/api/v...",
  //   data: {
  //   app_id: "c00daa11-bff6-4b2b-abfe,
  //   contents: {"en": "mensaje enviado"},
  //   android_group: "sameGroup",
  //   android_group_message: {"en": "Tiene $[notif_count] nuevos mensajes" },
  //   included_segments: ["All"]
  //   },
  //   headers: {
  //   'Authorization': 'Basic MDhhYTAxYzMtZjVkNy00MDc3LTlhNmEtMzA3'
  //   }
  //   });
  //   };

  // initializeFirebase() {
  //   this.fcm.getToken().then(token => {
  //     console.log(token, "token firebase");
  //     localStorage.setItem("tokenNotify", token);
  //     console.log(localStorage.getItem("tokenNotify"));
  //   });

  //   this.fcm.onNotification().subscribe(data => {
  //     console.log(data, "data de notificacion");
  //     if (data.wasTapped) {
  //       console.log("Received in background");
  //     } else {
  //       console.log("Received in foreground");
  //     }
  //   });
  // }

  // Listen to incoming FCM messages
}
