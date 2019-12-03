import { Component } from '@angular/core';
import { LoadingController, ToastController, Platform, MenuController, NavController, AlertController } from '@ionic/angular';
import { Info } from '../../shared/mock/months';
import { AuthService } from '../../../src/app/services/auth.service'
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
import { Socket } from 'ngx-socket-io';
import { fn } from '@angular/compiler/src/output/output_ast';
import { LocalNotifications, ILocalNotificationActionType} from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  data: any;
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
    public alertController: AlertController

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

    
  }

  ngOnInit() {
    this.simpleNotif();
  }

  async presentAlert(data) {
    const alert = await this.alertController.create({
      header: 'Detalle Cancelado',
      message: data,
      buttons: ['OK']
    });

    await alert.present();
  }

  unsub() {
    this.clickSub.unsubscribe();
  }

  simpleNotif() {
    this.clickSub = this.localNotifications.on('click').subscribe(data => {
      console.log(data, 'DATA EN NOTIFICACIONNNNN');
      this.presentAlert('Notificacion ok = ' + data.data.secret);
      this.unsub();
    });

    this.auth.getDataAlerts().subscribe((cita: any) => {
      if (cita.estadoCita === 'postponed') {
        this.localNotifications.schedule({
          id: 1,
          title: 'Cita Pospuesta',
          text: 'Fecha: ' + ' ' + cita.fecha + '' + 'hora:' + ' ' + cita.hora,
          data: {
            secret: 'Hora pospuesta',
            motivo: cita.estadoAgenda
          },
          sound: this.setSound(),
          icon: "res://icon.png",
          smallIcon: "res://icon.png",
        });

      } else if (cita.estadoCita === 'canceled') {
        this.localNotifications.schedule({
          id: 1,
          title: 'Cita Cancelada',
          text: 'Motivo' + '' + cita.detalleCancelado,
          data: {
            secret: 'Hora Cancelada',
            motivo: cita.detalleCancelado
          },
          sound: this.setSound(),
          icon: "res://icon.png",
          smallIcon: "res://icon.png",
        });
      }
    }, (err) => {
      console.log(err, 'error');
    });
  }

  setSound() {
    if (this.platform.is('android')) {
      return 'file://assets/www/assets/sound/sound.mp3'
    } else {
      return 'file://assets/www/assets/sound/sorted.m4r'
    }
  }

  getDataPac() {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user, 'user');
    const idPaciente = user ? user.id : null;
    console.log(idPaciente, 'ide del paciente');

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
      //this.navCtrl.push(component)
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
    //this.connection.unsubscribe();
  }

  ionViewDidEnter() {
    document.addEventListener("backbutton",function(e) {
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
