import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl
} from "@angular/forms";
import {
  NavController,
  NavParams,
  AlertController,
  ToastController,
  IonSlide,
  IonSlides
} from "@ionic/angular";

import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { LoadingService } from "src/app/services/loading.service";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { Crop } from "@ionic-native/crop/ngx";
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer/ngx";
import { DomSanitizer } from "@angular/platform-browser";
import { WebView } from "@ionic-native/ionic-webview/ngx";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"]
})
export class RegisterPage implements OnInit {
  @ViewChild("slider", { static: true }) slider: IonSlides;

  passwordType: string = "password";
  passwordIcon: string = "eye-off";
  user: any;
  id: any;
  submitted = false;
  user_admin: any = {
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: ""
  };
  myForm: FormGroup;
  formData = new FormData();
  public slideOneForm: FormGroup;
  public slideTwoForm: FormGroup;
  public submitAttempt: boolean = false;

  //currentImage: any;
  currentImage: string = "";
  data: any;
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
    private webview: WebView
  ) {
    this.slideOneForm = fb.group({
      priNombre: [
        "",
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern("[a-zA-Z ]*"),
          Validators.required
        ])
      ],
      segNombre: [],
      priApellido: [
        "",
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern("[a-zA-Z ]*"),
          Validators.required
        ])
      ],
      segApellido: [],
      email: ["", [Validators.email, Validators.required]],
      password: ["", Validators.required],
      identificacion: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^(?:[0-9]{10},)*[0-9]{10}$")
        ])
      ]
    });

    this.slideTwoForm = fb.group({
      sexo: ["", Validators.required],
      telefonoCelular: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^(?:[0-9]{10},)*[0-9]{10}$")
        ])
      ],
      ciudad: [
        "",
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern("[a-zA-Z ]*"),
          Validators.required
        ])
      ],
      fechaNaci: ["", Validators.required],
      //cboxPoliticas: [false, RegisterPage.mustBeTruthy],
      fotoPerfil: [""]
    });
  }

  ngOnInit() {
    this.slider.lockSwipes(true);
  }

  next() {
    this.slider.lockSwipes(false);
    this.slider.slideNext();
    this.slider.lockSwipes(true);
  }

  prev() {
    this.slider.lockSwipes(false);
    this.slider.slidePrev();
    this.slider.lockSwipes(true);
  }

  save() {
    this.submitAttempt = true;
    if (!this.slideOneForm.valid) {
      this.slider.slideTo(0);
    } else if (!this.slideTwoForm.valid) {
      this.slider.slideTo(1);
    } else {
      console.log("success!");
      console.log(this.slideOneForm.value);
      console.log(this.slideTwoForm.value);
    }
  }

  static mustBeTruthy(c: AbstractControl): { [key: string]: boolean } {
    let rv: { [key: string]: boolean } = {};
    if (!c.value) {
      rv["notChecked"] = true;
    }
    return rv;
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === "text" ? "password" : "text";
    this.passwordIcon = this.passwordIcon === "eye-off" ? "eye" : "eye-off";
  }

  changeListener($event): void {
    this.file = $event.target.files[0];
    this.formData.append("fotoPerfil", this.file);
  }

  upload() {
    this.auth.uploadImage(this.formData).subscribe(
      result => {
        console.log(result, "datos ok");
      },
      err => {
        console.log(err, "errores ");
      }
    );
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
      identificacion: identificacion
    };

    const fechaNac = new Date(this.slideTwoForm.value.fechaNaci)
      .toISOString()
      .slice(0, 10);
    const edad = this.getEdad(fechaNac);

    const _dataVerify = {
      email: email,
      cedula: identificacion
    };
    this.auth.verifyUser(_dataVerify).subscribe(
      verification => {
        console.log(verification, "verification");

        if (verification.result === "error") {
          this.presentToast();
        } else if (verification.result === "success") {
          this.auth.createUserPaciente(dataInf).subscribe(
            data => {
              this.auth.getIdUser(data.email).subscribe(data1 => {
                console.log(data1, "data con el id");
                //debugger
                Object.entries(this.slideTwoForm.value).forEach(
                  ([key, value]: any[]) => {
                    this.formData.set(key, value);
                  }
                );
                Object.entries(this.slideOneForm.value).forEach(
                  ([key, value]: any[]) => {
                    this.formData.set(key, value);
                  }
                );
                this.formData.append("userPaciente", data1[0].id);
                this.formData.append("fechaNaci", fechaNac);
                this.formData.append("edad", String(edad));
                this.auth.registerPaciente(this.formData).subscribe(data2 => {
                  this.auth.getInfoPac(data1[0].id).subscribe(data3 => {
                    console.log(data3, "data3");

                    localStorage.setItem(
                      "userPaciente",
                      JSON.stringify(data3[0])
                    );
                    this.router.navigate(["home"]);
                    this.slideOneForm.reset();
                    this.slideTwoForm.reset();
                  });
                });
              });
            },
            err => {
              console.log(err, "error en registro");
            }
          );
        }
      },
      err => {
        console.log(err, "verify user error");
      }
    );
  }

  goToLogin() {
    this.router.navigate(["login"]);
  }

  getEdad(dateString) {
    var hoy = new Date();
    var fechaNacimiento = new Date(dateString);
    var edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    var diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth();
    if (
      diferenciaMeses < 0 ||
      (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
    ) {
      edad--;
    }
    return edad;
  }

  async presentToast() {
    const toast = await this.tc.create({
      message: "email y/o cédula ya registrados",
      duration: 4000
    });
    toast.present();
  }

  //METODOS NUEVOS REGISTRO

  registerUser() {
    let datos: boolean;
    let cont = 0;
    datos = false;
    this.submitted = true;
    if (this.slideOneForm.invalid) {
      return;
    }
    let cedulaVer = this.slideOneForm.get("identificacion").value;
    let digito = cedulaVer.substring(9, 10);
    let cedula = cedulaVer.substring(0, 9);
    this.auth.verificaInfoUsuario(cedula, digito).subscribe(data => {
      let priNo = this.slideOneForm.get("priNombre").value;
      let segNo = this.slideOneForm.get("segNombre").value;
      let priApe = this.slideOneForm.get("priApellido").value;
      let segApe = this.slideOneForm.get("segApellido").value;
      console.log(data);
      if (data.length === 0) {
        const valCed = this.validarCedula(cedulaVer);
        console.log("valCed", valCed);
        if (valCed) {
          datos = true;
        }
      } else {
        const nombreComp = data[0].nombres.split(" ");
        for (let index = 0; index < nombreComp.length; index++) {
          if (nombreComp[index] == priNo.toUpperCase()) {
            cont++;
          } else if (segNo != "") {
            if (nombreComp[index] == segNo.toUpperCase()) {
              cont++;
            }
            if (nombreComp[index] == priApe.toUpperCase()) {
              cont++;
            } else if (segApe != "") {
              if (nombreComp[index] == segApe.toUpperCase()) {
                cont++;
              }
            }
          } else if (nombreComp[index] == segNo.toUpperCase()) {
            cont++;
          } else if (nombreComp[index] == priApe.toUpperCase()) {
            cont++;
          } else if (segApe != "") {
            if (nombreComp[index] == segApe.toUpperCase()) {
              cont++;
            }
          } else {
            if (nombreComp[index] == segApe.toUpperCase()) {
              cont++;
            }
          }
        }

        if (cont === nombreComp.length) {
          datos = true;
        }
      }
      if (datos) {
        console.log("puede registrar");
        const {
          priNombre,
          priApellido,
          email,
          password
        } = this.slideOneForm.value;
        const date = new Date(this.slideTwoForm.value.fechaNaci)
          .toISOString()
          .slice(0, 10);
        const edad = this.getEdad(date);
        const formData = new FormData();
        formData.append(
          "fotoPerfil",
          this.slideTwoForm.get("fotoPerfil").value
        );
        const dataInf = {
          first_name: priNombre,
          last_name: priApellido,
          email,
          username: email,
          password
        };
        const verUser = {
          email: email,
          cedula: this.slideOneForm.get("identificacion").value
        };
        this.auth.verificaUser(verUser).subscribe(data => {
          console.log(data.result);
          if (data.result == "error") {
            this.presentToastMessage("Error registrando: " + data.verificaUsu);
          } else if (data.result == "success") {
            this.auth.createUserPaciente(dataInf).subscribe(
              data => {
                this.auth.getIdUser(data.email).subscribe(data1 => {
                  Object.entries(this.slideTwoForm.value).forEach(
                    ([key, value]: any[]) => {
                      formData.set(key, value);
                    }
                  );
                  Object.entries(this.slideOneForm.value).forEach(
                    ([key, value]: any[]) => {
                      formData.set(key, value);
                    }
                  );
                  console.log("data1iduser", data1);
                  console.log("data1[0].id", data1[0].id);
                  this.id = data1[0].id;
                  formData.append("user", data1[0].id);
                  formData.append("fechaNaci", date);
                  formData.append("edad", String(edad));
                  console.log("FORM DATAAAAAAAAAAAAAAAAA", formData);
                  this.auth.registerPaciente(formData).subscribe(data2 => {
                    console.log("data2", data2);
                    this.auth.getInfoPac(data1[0].id).subscribe(data3 => {
                      console.log("data3", data3);
                      localStorage.setItem(
                        "userPaciente",
                        JSON.stringify(data3[0])
                      );
                      this.slideOneForm.reset();
                      this.slideTwoForm.reset();
                      this.router.navigate(["home"]);
                    });
                  });
                });
              },
              err => {
                this.presentToastMessage("Error registrando," + err.message);
              }
            );
          }
        });
      } else {
        console.log("no puede");
        this.presentToastMessage(
          "Los nombres no coincide con el número de Cédula Ingresado"
        );
      }
    });
  }

  async presentToastMessage(message) {
    const toast = await this.tc.create({
      message: message,
      duration: 2000,
      color: "dark"
    });
    toast.present();
  }

  validarCedula(cedula: string) {
    // Créditos: Victor Diaz De La Gasca.
    // Autor: Adrián Egüez
    // Url autor: https://gist.github.com/vickoman/7800717
    // Preguntamos si la cedula consta de 10 digitos
    if (cedula.length === 10) {
      // Obtenemos el digito de la region que sonlos dos primeros digitos
      const digitoRegion = cedula.substring(0, 2);
      // Pregunto si la region existe ecuador se divide en 24 regiones
      if (digitoRegion >= String(0) && digitoRegion <= String(24)) {
        // Extraigo el ultimo digito
        const ultimoDigito = Number(cedula.substring(9, 10));
        // Agrupo todos los pares y los sumo
        const pares =
          Number(cedula.substring(1, 2)) +
          Number(cedula.substring(3, 4)) +
          Number(cedula.substring(5, 6)) +
          Number(cedula.substring(7, 8));
        // Agrupo los impares, los multiplico por un factor de 2, si la resultante es > que 9 le restamos el 9 a la resultante
        let numeroUno: any = cedula.substring(0, 1);
        numeroUno = numeroUno * 2;
        if (numeroUno > 9) {
          numeroUno = numeroUno - 9;
        }
        let numeroTres: any = cedula.substring(2, 3);
        numeroTres = numeroTres * 2;
        if (numeroTres > 9) {
          numeroTres = numeroTres - 9;
        }
        let numeroCinco: any = cedula.substring(4, 5);
        numeroCinco = numeroCinco * 2;
        if (numeroCinco > 9) {
          numeroCinco = numeroCinco - 9;
        }
        let numeroSiete: any = cedula.substring(6, 7);
        numeroSiete = numeroSiete * 2;
        if (numeroSiete > 9) {
          numeroSiete = numeroSiete - 9;
        }
        let numeroNueve: any = cedula.substring(8, 9);
        numeroNueve = numeroNueve * 2;
        if (numeroNueve > 9) {
          numeroNueve = numeroNueve - 9;
        }
        const impares =
          numeroUno + numeroTres + numeroCinco + numeroSiete + numeroNueve;
        // Suma total
        const sumaTotal = pares + impares;
        // extraemos el primero digito
        const primerDigitoSuma = String(sumaTotal).substring(0, 1);
        // Obtenemos la decena inmediata
        const decena = (Number(primerDigitoSuma) + 1) * 10;
        // Obtenemos la resta de la decena inmediata - la suma_total esto nos da el digito validador
        let digitoValidador = decena - sumaTotal;
        // Si el digito validador es = a 10 toma el valor de 0
        if (digitoValidador === 10) {
          digitoValidador = 0;
        }
        // Validamos que el digito validador sea igual al de la cedula
        if (digitoValidador === ultimoDigito) {
          return true;
        } else {
          return false;
        }
      } else {
        // imprimimos en consola si la region no pertenece
        return false;
      }
    } else {
      // Imprimimos en consola si la cedula tiene mas o menos de 10 digitos
      return false;
    }
  }
}
