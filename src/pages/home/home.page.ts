import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, ToastController, Platform, MenuController, NavController, AlertController } from '@ionic/angular';
import { Info } from '../../shared/mock/months';
import { AuthService } from '../../../src/app/services/auth.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
import { Socket } from 'ngx-socket-io';
import { fn } from '@angular/compiler/src/output/output_ast';
import { LocalNotifications, ILocalNotificationActionType } from '@ionic-native/local-notifications/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  data: any;
  alert = false;
  dataUser: any;
  slides: any = [
    {
      src: 'https://png.pngtree.com/png-clipart/20190517/original/pngtree-dna-logo-with-chemical-structure-vector-template-icon-for-biotechnology-png-image_3654529.jpg',
      medicalCenter: 'CLÍNICA SAN JOSÉ', detalle: 'Expertos al cuidado de su salud Expertos al cuidado de su salud'
    },
    {
      src: 'https://png.pngtree.com/png-clipart/20190516/original/pngtree-abstract-hexagon-background--technology-polygonal-concept-vector-illustration-png-image_3786359.jpg',
      medicalCenter: 'CLÍNICA SAN JOSÉ', detalle: 'Expertos al cuidado de su salud Expertos al cuidado de su salud'
    },
    {
      src: 'https://png.pngtree.com/png-clipart/20190516/original/pngtree-pills-polygonal-two-capsule-pills-made-of-line-png-image_3786353.jpg',
      medicalCenter: 'CLÍNICA SAN JOSÉ', detalle: 'Expertos al cuidado de su salud Expertos al cuidado de su salud'
    }];
  connection: any;
  dataHome: any;
  imageUrl: any;
  clickSub: any;

  constructor(
    public navCtrl: NavController,
    public toast: ToastController,
    private auth: AuthService,
    public platform: Platform,
    public router: Router,
    private sanitizer: DomSanitizer,
    private backgroundMode: BackgroundMode,
    private localNotifications: LocalNotifications,
    public menuControler: MenuController,
    public alertController: AlertController,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,

  ) {
    this.data = Info.categories;
    this.dataUser = JSON.parse(localStorage.getItem('user'));
    this.imageUrl = this.dataUser.fotoPerfil;
    this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.imageUrl);
    this.getDataPac();
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user, 'user');
    const idPaciente = user ? user.id : 1;
    const fields: any = idPaciente;
    this.initializeApp();
    this.simpleNotif();
  }

  ngOnInit() {

    
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.backgroundMode.enable();
    });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  async presentAlert(data) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: data,
      buttons: ['OK']
    });

    await alert.present();
  }

  unsub() {
    this.clickSub.unsubscribe();
  }

  simpleNotif1() {
    this.clickSub = this.localNotifications.on('click').subscribe(data => {
      console.log(data);
      this.presentAlert('Your notifiations contains a secret = ' + data.data.secret);
      this.unsub();
    });
    this.localNotifications.schedule({
      id: 1,
      text: 'Single Local Notification',
      data: { secret: 'secret' }
    });

  }

  simpleNotif() {
    this.clickSub = this.localNotifications.on('click').subscribe(data => {
      console.log(data);
      this.router.navigate['meetings']
      this.presentAlert('Your notifiations contains a secret = ' + data.data.secret);
      this.unsub();
    });

    this.auth.getDataAlerts().subscribe((cita: any) => {
      console.log(cita.estadoCita, 'estado de la citaaaaa ');

      if (cita.estadoCita === 'postponed') {
        console.log(cita.paciente.id, 'id paciente');
        this.backgroundMode.isScreenOff((ok = true) => {
          this.backgroundMode.wakeUp();
        });
        this.localNotifications.schedule({
          id: cita.paciente.id,
          title: 'SU CITA FUE POSPUESTA',
          text: 'Fecha: ' + ' ' + cita.fecha + ' ' + 'hora:' + ' ' + cita.hora,
          data: { secret: cita.estadoCita },
          sound: this.platform.is('cordova') ? 'file://assets/sound/sound.mp3' : 'file://assets/sound/sorted.m4r',
          led: 'FF0000',
          foreground: true,
          icon: "res://icon.png",
          smallIcon: "res://icon.png",
        });
      } else if (cita.estadoCita === 'canceled') {
        this.backgroundMode.isScreenOff((ok = true) => {
          this.backgroundMode.wakeUp();
        });
        this.localNotifications.schedule({
          id: cita.paciente.id,
          title: 'Su Cita fué Cancelada',
          text: 'Motivo: ' + ' ' + cita.detalleCancelado,
          data: { secret: cita.estadoCita },
          sound: this.platform.is('cordova') ? 'file://assets/sound/sound.mp3' : 'file://assets/sound/sorted.m4r',
          led: 'FF0000',
          foreground: true,
          icon: "res://icon.png",
          smallIcon: "res://icon.png",
        });
        //this.alert = true;

      }
    }, (err) => {
      console.log(err, 'error');
    });
  }


  getDataPac() {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user, 'user');
    const idPaciente = user ? user.id : null;

    //const _data = { pkPaciente: idPaciente };
    this.auth.getMeetingAccepted(idPaciente).then(
      d => {
        console.log(d, 'DATOS DE PACIENTE');
        this.dataHome = _.first(d);
        console.log(this.dataHome, 'ultima cita agendada');
      });
  }

  goToMenu(component) {
    if (component) {
      this.router.navigateByUrl(component);
    } else {
      this.presentToast();
    }
  }

  async presentToast() {
    let toast = await this.toast.create({
      message: 'Componente en Construccion',
      duration: 3000,
    });
    toast.present();
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['login']);
    this.connection.unsubscribe();
    this.backgroundMode.disable()
  }

  ionViewDidEnter() {
    document.addEventListener("backbutton", function (e) {
      console.log("disable back button")
    }, false);
  }

  // async  loginWithGoogle() {
  //   this.dataGoogle = await this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
  //   console.log('datos google OK', this.dataGoogle);
  // }

  // async  loginWithFacebook() {
  //   this.dataFacebook = await this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider())
  //   console.log('datos facebook OK', this.dataFacebook);
  //   //localStorage.setItem('user', JSON.stringify(this.data));

  // }
}
