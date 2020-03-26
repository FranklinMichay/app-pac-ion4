import { Injectable } from "@angular/core";
import { ToastController, LoadingController } from "@ionic/angular";
@Injectable({
  providedIn: "root"
})
export class ToastService {
  constructor(
    public toastController: ToastController,
    public loadingCtrl: LoadingController
  ) {}

  getError(err) {
    let message = "Error desconocido";
    switch (err.status) {
      case 404:
        message = "Servidor no encontrado";
        return message;
      case 400:
        if (err.error.email) {
          message = "Ingrese un email valido";
        } else if (err.error.non_field_errors) {
          message = "Usuario y/o contraseña incorrectos";
        } else if (err.error.password1) {
          message =
            "Esta contraseña es demasiado corta. Debe contener almenos 8 caracteres";
        } else if (err.error.username) {
          message = "Nombre de usuario ya esta registrado";
        }
        return message;
      case 500:
        message = "Error en el servidor";
        return message;
      default:
        return message;
    }
  }
  // toast
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: this.getError(msg),
      duration: 4000
      // position: 'top'
    });
    toast.present();
  }

  async presentToastError(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: "dark"
    });
    toast.present();
  }
}
