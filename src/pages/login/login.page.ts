
import { Component, OnInit } from '@angular/core';
//import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForgotPasswordPage } from '../forgot-password/forgot-password.page';
import { AuthService } from '../../../src/app/services/auth.service'
import { MenuController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastService } from '../../../src/app/services/toast.service'
import { LoadingService } from '../../app/services/loading.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {



  user: any = {};
  userGoogle: any;
  items: any;
  data: any;
  responseData: any;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  data_login: any = {};

  form_login: FormGroup;
  user2: any = {};

  constructor(

    //public restProvider: RestProvider,
    public fb: FormBuilder,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public router: Router,
    private auth: AuthService,
    private toast: ToastService,
    private loadingCtrl: LoadingService,
    public toastController: ToastController
  ) {
    this.form_login = this.fb.group({
      usuario: ['', [Validators.email, Validators.required]],
      // password: ['', [Validators.pattern(/^[a-z0-9_-]{6,18}$/)]],
      password: ['', [Validators.required]]
    });

    if (localStorage.getItem('userPaciente')) {
      this.router.navigate(['home']);
    }
  }

  ngOnInit() {

  }

  public onLoginHandler() {
    this.menu.enable(true)
  }

  /* public logout() {
    this.menu.enable(false)
  } */

  guarda_user() {
    alert(JSON.stringify(this.form_login.value));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  setFilteredItems() {
    this.items = this.filterItems(this.user.email);
  }

  filterItems(searchTerm) {
    return this.data.filter((item) => {
      return item.email.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  getData() {
    let _data: any = {};
    _data.username = this.user.username.toString();
    _data.password = this.user.password.toString();
    this.auth.getToken(_data)
      .then((token) => {
        console.log(token, 'TOKEN');
        this.getIdPaciente(token);
      }, (err) => {
        this.toast.presentToast(err);
        //console.log('entro en getError');
        console.log(err, 'error en login');
      });
  }

  getIdPaciente(token) {
    this.auth.obtenerId(this.form_login.value, token)
      .subscribe(access => {
        console.log(access, 'Info acceso del servidor...!!!');
        if (access['result'] === 'success') {
          this.getInfoPaciente(access)
        } else {
          console.log(access, 'Error al acceder al servidor');
        }
      });
  }

  getInfoPaciente(data) {
    this.loadingCtrl.presentLoading();
    this.auth.getInfoPaciente(data).subscribe(dataPaciente => {

      if (dataPaciente.length > 0) {
        if (dataPaciente[0].tipoUsu === 'paciente') {
          console.log('DATOS PACIENTE', dataPaciente[0]);
          localStorage.setItem('userPaciente', JSON.stringify(dataPaciente[0]));
          this.form_login.reset();
          this.loadingCtrl.dismiss();
          this.router.navigate(['home']);
        }
      } else {
        this.presentToast();
        this.loadingCtrl.dismiss();
      }

    },
    error => {
      console.log(error, 'error');
    }
    );
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  goToRegister() {
    this.router.navigate(['register']);
  }

  goToForgotPass() {
    this.router.navigate(['forgot-password']);
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Usuario no registrado',
      duration: 2000,
      color: 'dark'
    });
    toast.present();
  }


}
