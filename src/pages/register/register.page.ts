import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NavController, NavParams, AlertController, ToastController, IonSlide, IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { WebView } from '@ionic-native/ionic-webview/ngx';



@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


  @ViewChild('slider', { static: true }) slider: IonSlides;

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

  //currentImage: any;
  currentImage: string = '';
  data: any
  sanitizeImg: any;
  imageURI: any;
  imageFileName: any;
  file: File;

  constructor(
    public alertCtrl: AlertController,
    public fb: FormBuilder,
    public tc: ToastController,
    private router: Router,
    private auth: AuthService,
    private loadingCtrl: LoadingService,
    private transfer: FileTransfer,
    private imagePicker: ImagePicker,
    private sanitizer: DomSanitizer,
    private webview: WebView,
  ) {

    this.slideOneForm = fb.group({
      priNombre: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      segNombre: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      priApellido: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      segApellido: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      identificacion: ['', Validators.compose([Validators.required, Validators.pattern('^(?:[0-9]{10},)*[0-9]{10}$')])],
    });

    this.slideTwoForm = fb.group({
      sexo: ['', Validators.required],
      telefonoCelular: ['', Validators.compose([Validators.required, Validators.pattern('^(?:[0-9]{10},)*[0-9]{10}$')])],
      ciudad: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      fechaNaci: ['', Validators.required],
      cboxPoliticas:  [false, RegisterPage.mustBeTruthy]
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

  static mustBeTruthy(c: AbstractControl): { [key: string]: boolean } {
    let rv: { [key: string]: boolean } = {};
    if (!c.value) {
      rv['notChecked'] = true;
    }
    return rv;
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  changeListener($event): void {
    this.file = $event.target.files[0];
    this.formData.append('fotoPerfil', this.file);
  }

  upload() {
    this.auth.uploadImage(this.formData).subscribe(result => {
      console.log(result, 'datos ok');
    }, (err) => {
      console.log(err, 'errores ');
    });
  }

  onSubmit() {
    const {
      priNombre,
      segNombre,
      priApellido,
      segApellido,
      email,
      password,
      identificacion
    } = this.slideOneForm.value;

    const dataInf = {
      first_name: priNombre,
      last_name: priApellido,
      email: email,
      username: email,
      password,
      identificacion: identificacion,
    }

    const fechaNac = new Date(this.slideTwoForm.value.fechaNaci).toISOString().slice(0, 10);
    const edad = this.getEdad(fechaNac);

    const _dataVerify = {
      email: email,
      cedula: identificacion,
    }
    this.auth.verifyUser(_dataVerify).subscribe(verification => {
      console.log(verification, 'verification');
      
      if (verification.result === 'error') {
        this.presentToast();
      } else if (verification.result === 'success') {
        this.auth.createUserPaciente(dataInf).subscribe(data => {
          this.auth.getIdUser(data.email).subscribe(data1 => {
            console.log(data1, 'data con el id');
            //debugger
            Object.entries(this.slideTwoForm.value).forEach(
              ([key, value]: any[]) => {
                this.formData.set(key, value);
              }
            )
            Object.entries(this.slideOneForm.value).forEach(
              ([key, value]: any[]) => {
                this.formData.set(key, value);
              }
            )
            this.formData.append('user', data1[0].id);
            this.formData.append('fechaNaci', fechaNac);
            this.formData.append('edad', String(edad));
            this.auth.registerPaciente(this.formData).subscribe(data2 => {
              this.auth.getInfoPac(data1[0].id).subscribe(data3 => {

                localStorage.setItem('user', JSON.stringify(data3[0]));
                this.slideOneForm.reset();
                this.slideTwoForm.reset();
                this.router.navigate(['home']);
              })
            })
          })
        }, (err) => {
          console.log(err, 'error en registro');
        });

      }

    }, (err) => {
      console.log(err, 'verify user error');
    });
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

  getEdad(dateString) {
    var hoy = new Date()
    var fechaNacimiento = new Date(dateString)
    var edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
    var diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth()
    if (
      diferenciaMeses < 0 ||
      (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
    ) {
      edad--
    }
    return edad
  }

  async presentToast() {
    const toast = await this.tc.create({
      message: 'email y/o cédula ya registrados',
      duration: 4000
    });
    toast.present();
  }
}

