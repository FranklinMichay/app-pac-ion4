import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  data: any
  //form_editar_profile: FormGroup;
  
  constructor(
    private router: Router,
    public tc: ToastController,
  ) {
    this.data = this.router.getCurrentNavigation().extras.state;
    // this.form_editar_profile = this.fb.group({
    //   nombre: '',
    //   apellido: '',
    //   profile_pic: '',
    //   direccion: '',
    //   edad: "",
    //   ciudad: "",
    //   fuenteIngreso: "",
    //   identificacion: "",
    //   lugarNaci: "",
    //   ocupacion: "",
    //   sexo: "",
    //   fecha: "",
    //   telefonoFijo: "",
    //   tipoSeguro: "",
    //   telefonoCelular: ''
    // });
   }

  ngOnInit() {
  }

}
