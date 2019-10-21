import { Component } from '@angular/core';
import { LoadingController, ToastController, Platform, MenuController, NavController } from '@ionic/angular';
import { Info } from '../../shared/mock/months';
import { AuthService } from '../../../src/app/services/auth.service'
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Router } from '@angular/router';
import * as _ from 'lodash';

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
  
  constructor(
    private loadingController: LoadingController,
    public navCtrl: NavController,
    public toast: ToastController,
    private auth: AuthService,
    public platform: Platform,
    public router: Router,
    //public backgroundMode: BackgroundMode,
   // public localNotifications: LocalNotifications,
    public menuControler: MenuController,
  ) {
    this.data = Info.categories;
    this.dataUser = JSON.parse(localStorage.getItem('user'));
    console.log(this.dataUser, 'datos de paciente');
    
    // this.getDataPac();
    // const user = JSON.parse(localStorage.getItem('user'));
    // console.log(user, 'user');
    // const pkPaciente = user ? user.pk : 1;
    // const fields: any = { pkPaciente: pkPaciente };
    // this.connection = this.auth.getMeetingData(fields).subscribe((data: any) => {
    //   if (data.dataNews && data.medicName) {
    //     if (this.platform.is('cordova')) {
    //       //REVISAR ISENABLE CON ISOFF
    //       if (this.backgroundMode.isEnabled()) {
    //         this.backgroundMode.wakeUp();
    //         this.localNotifications.schedule({
    //           id: 1,
    //           text: data.type,
    //           sound: this.platform.is('android') ? 'file://assets/sound/sound.mp3' : 'file://assets/sound/sorted.m4r',
    //           data: { secret: 'key' },
    //           wakeup: true,
    //           title: data.medicName,
    //           actions: 'click',
    //           launch: true
    //         })
    //       }
    //     }
    //   }
    // }, (err) => {
    //   console.log(err, 'error');
    // });
  }

  ngOnInit() {
    
  }

  getDataPac() {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user, 'user');
    const pkPaciente = user ? user.pk : null;
    const _data = { pkPaciente: pkPaciente };
    this.auth.getMeetingAccepted(_data).then(
      d => {
        console.log(d, 'DATOS DE PACIENTE');
        this.dataHome = _.first(d['data_agenda']);
        console.log(this.dataHome);
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
    //this.navCtrl.setRoot(LoginPage);
    //this.connection.unsubscribe();
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