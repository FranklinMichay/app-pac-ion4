import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Crop } from '@ionic-native/crop/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  currentImage: any;
  data: any

  image;
  imageData;
  //form_editar_profile: FormGroup;
  formEditProfile: FormGroup
  formData = new FormData();

  fileUrl: any = null;
  respData: any;
  file: File;

  constructor(
    private router: Router,
    public tc: ToastController,
    private fb: FormBuilder,
    private auth: AuthService,
    private loadingCtrl: LoadingService,

  ) {
    this.data = this.router.getCurrentNavigation().extras.state;
    console.log(this.data.id);

    this.formEditProfile = this.fb.group({
      priNombre: ['', Validators.compose([Validators.required])],
      telefonoCelular: ['', Validators.compose([Validators.required, Validators.pattern('^(?:[0-9]{10},)*[0-9]{10}$')])],
      //email: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      priApellido: ['', Validators.compose([Validators.required])],
      ciudad: ['', Validators.compose([Validators.required])],
      identificacion: ['', Validators.compose([Validators.required, Validators.pattern('^(?:[0-9]{10},)*[0-9]{10}$')])],
      estadoCivil: ['', Validators.compose([Validators.required])],
      numCasa: ['', Validators.compose([Validators.required, Validators.pattern('^(?:[0-9]{6},)*[0-9]{6}$')])],
    });
  }

  ngOnInit() {
  }
  // onChange(event) {
  //   const file = event.target.files[0];
  //   this.registerForm.get('fotoPerfil').setValue(file);
  // }

  

  upload() {
    const date = new Date().valueOf();

    // Replace extension according to your media type
    const imageName = date + '.jpeg';
    // call method that creates a blob from dataUri
    const imageBlob = this.dataURItoBlob(this.currentImage);
    const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' })

    let postData = new FormData();
    postData.append('file', imageFile);
    //console.log(postData, 'foto perfil ok....');


    // let data:Observable<any> = this.http.post(url,postData);
    // data.subscribe((result) => {
    //   console.log(result);
    // });
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }
  changeListener($event): void {
    this.file = $event.target.files[0];
    this.formData.append('fotoPerfil', this.file);
  }

  updateProfilePatient() {
    Object.entries(this.formEditProfile.value).forEach(
      ([key, value]: any[]) => {
        this.formData.set(key, value);
      }
    )
    this.formData.append('user_id', this.data.user.id);
    this.auth.updateProfilePatient(this.formData, this.data.id).subscribe(data => {
      if (data.fotoPerfil[0] !== 'h') {
        let foto = 'http://192.168.0.107:9000' + data.fotoPerfil;
        data.fotoPerfil = foto;
      }
      //console.log(data, 'DATA NUEVA');

      localStorage.setItem('user', JSON.stringify(data));
      this.router.navigate(['home']);
    }, (err) => {
      console.log(err, 'errores');
    });
  }

  returnHome() {
    this.router.navigate(['home']);
  }
}
