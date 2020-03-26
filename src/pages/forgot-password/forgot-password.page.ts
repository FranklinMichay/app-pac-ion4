import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.page.html",
  styleUrls: ["./forgot-password.page.scss"]
})
export class ForgotPasswordPage implements OnInit {
  email: any;
  passInfoSuccess: any = false;
  resetPassForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private auth: AuthService,
    public router: Router,
    public tc: ToastController
  ) {
    this.resetPassForm = this.fb.group({
      email: ["", [Validators.email, Validators.required]]
    });
  }

  ngOnInit() {}

  onSubmitRecovery() {
    const { email } = this.resetPassForm.value;

    const _dataVerify = {
      email: email
    };
    this.auth.verifyUserEmail(_dataVerify).subscribe(
      verification => {
        console.log(verification);
        if (verification.result === "error") {
          this.presentToast();
        } else if (verification.result === "success") {
          const data = {
            type: "paciente",
            email: this.resetPassForm.value.email
          };
          console.log(data, "Datos para server..!!");
          this.auth.recoveryPassword(data).subscribe(
            data => {
              console.log("datos para enviar", data);
              if (data.result === "success") {
                console.log("Pedido enviado, Revise su correo");
                this.passInfoSuccess = true;
              } else console.log("Error enviando, intentelo de nuevo");
            },
            err => {
              console.log(err, "Error en el servidor, intentar luego");
            }
          );
        }
      },
      err => {
        console.log(err, "verify user error");
      }
    );
  }

  async presentToast() {
    const toast = await this.tc.create({
      message: "CORREO NO REGISTRADO",
      duration: 4000
    });
    toast.present();
  }

  goToLogin() {
    this.router.navigate(["login"]);
  }
}
