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
  formEditProfile: FormGroup
  
  constructor(
    private router: Router,
    public tc: ToastController,
    private fb: FormBuilder
  ) {
    this.data = this.router.getCurrentNavigation().extras.state;
    this.formEditProfile = this.fb.group({
      nombre: '',
      apellido: '',
      ciudad: '',
      identificacion: '',
      telefonoCelular: '',
      username:''
    });
   }

  ngOnInit() {
  }

}
