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

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

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
  subscription: any;

  slideOptsOne = {
    // initialSlide: 0,
    // slidesPerView: 1,
    autoplay: true
  };

  cita: any;

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
    if (this.connection !== undefined) {
      this.connection.unsubscribe();
    }
    this.connection = this.auth.getDataAlerts().subscribe((cita: any) => {
      this.cita = cita;
      this.notification();
      console.log(this.cita, 'cita alert');
    }, (err) => {
      console.log(err, 'error getAlerts');
    });
  }

  notification() {
      this.localNotifications.on('click').subscribe(data => {
        console.log(data);
        this.presentAlert(
          'Médico:' + ' ' + data.data.medico + '<br>' +
          'fecha:' + ' ' + data.data.fecha + '<br>' +
          'hora:' + ' ' + data.data.hora + '<br>' +
          'motivo:' + ' ' + data.data.motivo
        );
      });

      if (this.cita.estadoCita === 'postponed') {
        console.log(this.cita.paciente.id, 'id paciente');
        this.localNotifications.schedule(
          {
            id: this.cita.paciente.id,
            title: 'SU CITA FUE POSPUESTA',
            text: 'Fecha: ' + ' ' + this.cita.fecha + ' ' + 'hora:' + ' ' + this.cita.hora,
            data: {
              medico: this.cita.medico.priNombre + ' ' + this.cita.medico.priApellido,
              fecha: this.cita.fecha,
              hora: this.cita.hora,
              motivo: ''
            },
            sound: this.platform.is('android') ? 'file://assets/sound/sound.mp3' : 'file://assets/sound/sorted.m4r',
            smallIcon: 'res://drawable-hdpi/ic_launcher.png',
            icon: "res://icon.png"
          });

      } else if (this.cita.estadoCita === 'canceled') {
        this.localNotifications.schedule({
          id: this.cita.paciente.id,
          title: 'SU CITA FUE CANCELADA',
          text: 'Motivo: ' + ' ' + this.cita.detalleCancelado,
          data: {
            medico: this.cita.medico.priNombre + ' ' + this.cita.medico.priApellido,
            fecha: this.cita.fecha,
            hora: this.cita.hora,
            motivo: this.cita.detalleCancelado
          },
          sound: this.platform.is('android') ? 'file://assets/sound/sound.mp3' : 'file://assets/sound/sorted.m4r',
          smallIcon: 'res://drawable-hdpi/ic_launcher.png',
          icon: "res://icon.png",
        });
      }
  }

  // ngOnDestroy() {
  //   this.connection.unsubscribe();

  // }

  async presentAlert(data) {
    const alert = await this.alertController.create({
      header: 'Detalles:',
      message: data,
      buttons: [
        {
          text: 'OK',

        }, {
          text: 'Ir a mis Citas',
          handler: () => {
            this.router.navigate(['meetings']);
            console.log('Ir a mis Citas');
          }
        }
      ]

    });

    await alert.present();
  }

  // unsub() {
  //   this.clickSub.unsubscribe();
  // }

  simpleNotif() {
    debugger;
    this.localNotifications.on('click').subscribe(data => {
      console.log(data);
      this.presentAlert(
        'Médico:' + ' ' + data.data.medico + '<br>' +
        'fecha:' + ' ' + data.data.fecha + '<br>' +
        'hora:' + ' ' + data.data.hora + '<br>' +
        'motivo:' + ' ' + data.data.motivo
      );
    });
    // if (this.platform.is('cordova')) {

    // this.backgroundMode.isScreenOff(() => {
    //   this.backgroundMode.wakeUp();
    if (this.connection !== undefined) {
      this.connection.unsubscribe();
    }
    this.connection = this.auth.getDataAlerts().subscribe((cita: any) => {
      console.log(cita.estadoCita, 'estado de la citaaaaa ');
      if (cita.estadoCita === 'postponed') {
        console.log(cita.paciente.id, 'id paciente');
        this.localNotifications.schedule(
          {
            id: cita.paciente.id,
            title: 'SU CITA FUE POSPUESTA',
            text: 'Fecha: ' + ' ' + cita.fecha + ' ' + 'hora:' + ' ' + cita.hora,
            summary: cita.paciente.id,
            group: cita.paciente.id,
            groupSummary: true,
            data: {
              medico: cita.medico.priNombre + cita.medico.priApellido,
              fecha: cita.fecha,
              hora: cita.hora,
              motivo: ''
            },
            sound: this.platform.is('android') ? 'file://assets/sound/sound.mp3' : 'file://assets/sound/sorted.m4r',
            smallIcon: 'res://drawable-hdpi/ic_launcher.png',
            icon: "res://icon.png"
          });

      } else if (cita.estadoCita === 'canceled') {
        this.localNotifications.schedule({
          id: cita.paciente.id,
          title: 'SU CITA FUE CANCELADA',
          text: 'Motivo: ' + ' ' + cita.detalleCancelado,
          summary: cita.paciente.id,
          group: cita.paciente.id,
          groupSummary: true,
          data: {
            medico: cita.medico.priNombre + cita.medico.priApellido,
            fecha: cita.fecha,
            hora: cita.hora,
            motivo: cita.detalleCancelado
          },
          sound: this.platform.is('android') ? 'file://assets/sound/sound.mp3' : 'file://assets/sound/sorted.m4r',
          smallIcon: 'res://drawable-hdpi/ic_launcher.png',
          icon: "res://icon.png",
        });
      }
    }, (err) => {
      console.log(err, 'error');
    });
    //});
    //}
  }

  getDataPac() {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user, 'user');
    const idPaciente = user ? user.id : null;
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
    this.backgroundMode.disable()
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
