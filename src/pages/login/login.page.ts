
import { Component, OnInit } from '@angular/core';
//import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForgotPasswordPage } from '../forgot-password/forgot-password.page';
import { AuthService } from '../../../src/app/services/auth.service'
import { MenuController, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';


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
    public tc: ToastController,
    public menu: MenuController,
    public router: Router,
    private auth: AuthService
  ) {
    this.form_login = this.fb.group({
      usuario: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.pattern(/^[a-z0-9_-]{6,18}$/)]]
    });
  }

  ngOnInit() {
    if (localStorage.getItem('user')) {
      this.router.navigate(['home']);
    }
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
        console.log(err);
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

  async presentToast() {
    const toast = await this.tc.create({
      message: 'Your settings have been saved.',
      duration: 2000
    });
    toast.present();
  }

  getInfoPaciente(data) {
    this.auth.getInfoPaciente(data).subscribe(dataPaciente => {
      console.log('DATOS PACIENTE', dataPaciente[0]);
      localStorage.setItem('user', JSON.stringify(dataPaciente[0]));
      this.router.navigate(['home']);
    })
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
}
