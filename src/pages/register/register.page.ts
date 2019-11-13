import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams, AlertController, ToastController, IonSlide, IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AgeValidator } from 'src/app/validators/age';
import { UsernameValidator } from 'src/app/validators/username';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


  //@ViewChild('slider') slider;
  @ViewChild('slider') slider;


  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  user: any;
  user_admin: any = {
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  };
  myForm: FormGroup;
  formData = new FormData();
  public slideOneForm: FormGroup;
  public slideTwoForm: FormGroup;

  public submitAttempt: boolean = false;


  constructor(
    public alertCtrl: AlertController,
    public fb: FormBuilder,
    public tc: ToastController,
    private router: Router,
    private auth: AuthService,
    private loadingCtrl: LoadingService,
  ) {

    this.slideOneForm = fb.group({
      // firstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      // lastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      // age: ['', AgeValidator.isValid],
      priNombre: ['', Validators.required],
      priApellido: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
    });

    this.slideTwoForm = fb.group({
      // username: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*')]), UsernameValidator.checkUsername],
      // privacy: ['', Validators.required],
      // bio: ['']
      //fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      identificacion: ['', Validators.required],
      telefonoCelular: ['', Validators.required],
      ciudad: ['', Validators.required],

    });
  }

  ngOnInit() {
    this.slider.lockSwipes(true)
  }

  next() {
    this.slider.lockSwipes(false)
    this.slider.slideNext()
    this.slider.lockSwipes(true)
  }

  prev() {
    this.slider.lockSwipes(false)
    this.slider.slidePrev()
    this.slider.lockSwipes(true)
  }

  save() {

    this.submitAttempt = true;

    if (!this.slideOneForm.valid) {
      this.slider.slideTo(0);
    }
    else if (!this.slideTwoForm.valid) {
      this.slider.slideTo(1);
    }
    else {
      console.log("success!")
      console.log(this.slideOneForm.value);
      console.log(this.slideTwoForm.value);
    }
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  public cancelar() {
    //this.navCtrl.push(LoginPage);
  }

  onSubmit() {
    const {
      priNombre,
      priApellido,
      email,
      password,
    } = this.slideOneForm.value;

    const dataInf = {
      first_name: priNombre,
      last_name: priApellido,
      email,
      username: email,
      password,
    }
    this.auth.createUserPaciente(dataInf).subscribe(data => {
      this.auth.getIdUser(data.email).subscribe(data1 => {
        console.log(data1, 'data con el id');
        //debugger
        Object.entries(this.slideTwoForm.value).forEach(
          ([key, value]: any[]) => {
            this.formData.set(key, value);
          }
        )
        this.formData.append('user', data1[0].id);
        this.auth.registerPaciente(this.formData).subscribe(data2 => {
          this.auth.getInfoPac(data1[0].id).subscribe(data3 => {
            localStorage.setItem('user', JSON.stringify(data3[0]));
            this.router.navigate(['home']);
          })
        })
      })
    }, (err) => {
      console.log(err, 'error en registro');
    });
  }

  goToLogin() {
    this.router.navigate(['login']);
  }
}
