import { log } from "util";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavController, ToastController } from "@ionic/angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { LoadingService } from "src/app/services/loading.service";
import { Crop } from "@ionic-native/crop/ngx";
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer/ngx";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.page.html",
  styleUrls: ["./edit-profile.page.scss"]
})
export class EditProfilePage implements OnInit {
  currentImage: any;
  data: any;

  image;
  imageData;
  //form_editar_profile: FormGroup;
  formEditProfile: FormGroup;
  formData = new FormData();

  fileUrl: any = null;
  respData: any;
  file: File;

  url: any;

  constructor(
    private router: Router,
    public tc: ToastController,
    private fb: FormBuilder,
    private auth: AuthService,
    private loadingCtrl: LoadingService
  ) {
    this.url = environment.url;
    this.data = this.router.getCurrentNavigation().extras.state;
    console.log(this.data.id);

    this.formEditProfile = this.fb.group({
      priNombre: ['', Validators.compose([Validators.required])],
      telefonoCelular: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern("^(?:[0-9]{6,10},)*[0-9]{6,10}$")
        ])
      ],
      //email: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      priApellido: ['', Validators.compose([Validators.required])],
      ciudad: ['', Validators.compose([Validators.required])],
      identificacion: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern("^(?:[0-9]{10},)*[0-9]{10}$")
        ])
      ],
      //estadoCivil: [''],
      //numCasa: [''],
      estadoCivil: ['', Validators.compose([Validators.required])],
      //numCasa: ['', Validators.compose([Validators.required, Validators.pattern('^(?:[0-9]{5},)*[0-9]{5}$')])],
      fotoPerfil: [''],
    });
  }

  ngOnInit() {}

  changeListener($event): void {
    this.file = $event.target.files[0];
    this.formEditProfile.get('fotoPerfil').setValue(this.file);
    //this.formData.append("fotoPerfil", this.file);
  }

  updateProfilePatient() {
    this.loadingCtrl.presentLoading();
    Object.entries(this.formEditProfile.value).forEach(
      ([key, value]: any[]) => {
        this.formData.set(key, value);
      }
    );
    this.formData.append("user_id", this.data.user.id);
    this.formData.append('fotoPerfil', this.formEditProfile.get('fotoPerfil').value);
    var object = {};
    this.formData.forEach(function(value, key) {
      object[key] = value;
    });
    var json = JSON.stringify(object);
    console.log(json, "form data para form");

    this.auth.updateProfilePatient(this.formData, this.data.id).subscribe(
      data => {
        console.log(data, "data updateprofile");

        this.auth.getInfoPaciente1(data.user).subscribe(
          data1 => {
            console.log(data1, "data1 respuesta");

            localStorage.setItem("userPaciente", JSON.stringify(data1[0]));
            if (data.fotoPerfil !== null) {
              if (data.fotoPerfil[0] !== "h") {
                let foto = this.url + data.fotoPerfil;
                data.fotoPerfil = foto;
              }
            }
          },
          err => {
            console.log(err, "error data1");
          }
        );
        this.loadingCtrl.dismiss();
        this.router.navigate(["home"]);
      },
      err => {
        console.log(err, "errores");
        this.loadingCtrl.dismiss();
      }
    );
  }

  returnHome() {
    this.router.navigate(["home"]);
  }
}
