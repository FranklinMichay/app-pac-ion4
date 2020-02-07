import { formatDate } from '@angular/common';
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
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';
import { NetworkService } from 'src/app/services/network-service.service';
import { ToastService } from 'src/app/services/toast.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  isConnected = false;
  url: any;
  data: any;
  alert = false;
  dataUser: any;
  slides: any = [
    {
      src: 'assets/imgs/slide2.jpg',
      medicalCenter: 'CLÍNICA MEDIPHARM', detalle: 'Expertos al cuidado de su salud Expertos al cuidado de su salud'
    },
    {
      src: 'assets/imgs/slide6.jpg',
      medicalCenter: 'FARMACIA SAN DANIEL', detalle: 'Expertos al cuidado de su salud Expertos al cuidado de su salud'
    },
    {
      src: 'assets/imgs/slide3.jpg',
      medicalCenter: 'LABORATORIO CLINICO LOJA', detalle: 'Expertos al cuidado de su salud Expertos al cuidado de su salud'
    }];
  connection: any;
  dataHome: any;
  dataHomeDelete: any;
  imageUrl: any;
  clickSub: any;
  subscription: any;
  slideOptsOne = {
    // initialSlide: 0,
    // slidesPerView: 1,
    autoplay: true
  };
  cita: any;
  worker: Subscription;
  backButtonSubscription;
  hora: any;
  fecha: any;
  price: any = '';

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
    private route: ActivatedRoute,
    private fcm: FCM,
    public plt: Platform,
    private networkService: NetworkService,
    private toastService: ToastService,
    private loadingCtrl: LoadingService
  ) {

    this.price = this.route.snapshot.params['price'];

    this.data = Info.categories;
    this.dataUser = JSON.parse(localStorage.getItem('userPaciente'));
    this.imageUrl = this.dataUser.fotoPerfil;
    this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.imageUrl);
    this.url = environment.url;
    const user = JSON.parse(localStorage.getItem('userPaciente'));
    console.log(user, 'userPaciente');
    const idPaciente = user ? user.id : 1;
    if (this.connection !== undefined) {
      this.connection.unsubscribe();
      this.auth.removeListener('calendar');
    }

    this.connection = this.auth.getDataAlerts().subscribe((cita: any) => {
      this.cita = cita;
      console.log('entro en socket alerta');
      this.getDataPac();
      this.notification();
    }, (err) => {
      console.log(err, 'error getAlerts');
    });
    
    this.clickSub = this.localNotifications.on('click').subscribe(data => {
      this.presentAlert(
        'Médico:' + ' ' + data.data.medico + '<br>' +
        'fecha:' + ' ' + data.data.fecha + '<br>' +
        'hora:' + ' ' + data.data.hora + '<br>' +
        'motivo:' + ' ' + data.data.motivo
      );
    });
  }

  ngOnInit() {
    this.data = Info.categories;
    this.dataUser = JSON.parse(localStorage.getItem('userPaciente'));
    this.imageUrl = this.dataUser.fotoPerfil;
    this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.imageUrl);
    this.url = environment.url;
    const user = JSON.parse(localStorage.getItem('userPaciente'));
    console.log(user, 'userPaciente');
    const idPaciente = user ? user.id : 1;
    
    let now = new Date();
    this.fecha = formatDate(now, 'yyyy-MM-dd', 'en-US')
    var hora = ('0' + new Date().getHours()).substr(-2);
    var min = ('0' + new Date().getMinutes()).substr(-2);
    var seg = ('0' + new Date().getSeconds()).substr(-2);
    this.hora = hora + ':' + min + ':' + seg;
    console.log(this.fecha, this.hora, 'hora y fecha');
    this.getDataPac();   
  }

  

  testNetwork(){
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      if (!this.isConnected) {
          console.log('Por favor enciende tu conexión a Internet');
      }
});
  }

  ionViewWillEnter() {
    this.getDataPac();
  }

  ionViewDidLeave() {
  }

  notification() {

    if (this.cita.estadoCita === 'postponed') {
      this.localNotifications.schedule(
        {
          id: this.cita.paciente.id,
          title: 'SU CITA FUE POSPUESTA',
          text:
            'Fecha: ' + ' ' + this.cita.fecha + '\n'
            + 'hora:' + ' ' + this.cita.hora,
          data: {
            medico: this.cita.medico.priNombre + ' ' + this.cita.medico.priApellido,
            fecha: this.cita.fecha,
            hora: this.cita.hora,
            motivo: ''
          },
          sound: this.platform.is('android') ? 'file://assets/sound/sound.mp3' : 'file://assets/sound/sorted.m4r',
          smallIcon: 'res://drawable-hdpi/ic_launcher.png',
          icon: "res://drawable-hdpi/ic_launcher.png",
          foreground: true,
        });
    } else if (this.cita.estadoCita === 'canceled') {
      this.localNotifications.schedule({

        id: this.cita.paciente.id,
        title: 'SU CITA FUE CANCELADA',
        text:
          'Motivo: ' + ' ' + this.cita.detalleCancelado + '\n'
          + 'Fecha:' + ' ' + this.cita.fecha + '\n'
          + 'hora:' + ' ' + this.cita.hora,
        data: {
          medico: this.cita.medico.priNombre + ' ' + this.cita.medico.priApellido,
          fecha: this.cita.fecha,
          hora: this.cita.hora,
          motivo: this.cita.detalleCancelado
        },
        sound: this.platform.is('android') ? 'file://assets/sound/sound.mp3' : 'file://assets/sound/sorted.m4r',
        smallIcon: 'res://drawable-hdpi/ic_launcher.png',
        icon: "res://drawable-hdpi/ic_launcher.png",
        foreground: true,
      });
    }
  }

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

  unsub() {
    this.clickSub.unsubscribe();
  }

  getDataPac() {
    const user = JSON.parse(localStorage.getItem('userPaciente'));
    const idPaciente = user ? user.id : null;
    //this.loadingCtrl.presentLoading();
    this.auth.getMeetingData(idPaciente).subscribe((cita: any) => {
      var citaFilter = _.filter(cita, item => item.fecha >= this.fecha);
      citaFilter = _.orderBy(citaFilter, ['fecha'], ['asc']);
      console.log(citaFilter, 'CITAS PACIENTE ACCEPTED');
      //console.log(this.hora, 'hora actual');
      this.dataHomeDelete = _.filter(citaFilter, item => item.hora >= this.hora);
      this.dataHome = _.first(this.dataHomeDelete);
      console.log(this.dataHome, 'PROXIMA CITA PACIENTE');
      //this.loadingCtrl.dismiss();
    }, (err) => {
      console.log(err, 'error ultima cita');
      //this.loadingCtrl.dismiss();
    });
  }

  removeData(id) {
    _.remove(this.dataHome, function (n) {
      return n.id === id;
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
    this.connection.unsubscribe();
    this.auth.removeListener('calendar');
    localStorage.removeItem('userPaciente');
    this.unsub();
    this.router.navigate(['login']);
  }

  // OnDestroy() {
  //   this.connection.unsubscribe();
  //   this.auth.removeListener('calendar');

  // }

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
