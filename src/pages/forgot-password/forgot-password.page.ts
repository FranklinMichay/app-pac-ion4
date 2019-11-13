import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  email: any;
  passInfoSuccess: any = false;
  resetPassForm: FormGroup;
  

  constructor(
    public fb: FormBuilder,
    private auth: AuthService,
    public router: Router,
  ) {
    this.resetPassForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
    });
  }

  ngOnInit() {
  }

  onSubmitRecovery() {
    const data = { type: 'paciente', email: this.resetPassForm.value.email }
    console.log(data, 'Datos para server..!!');
    this.auth.recoveryPassword(data).subscribe(data => {
      console.log('datos para enviar', data);
      if (data.result === 'success') {
        console.log('Pedido enviado, Revise su correo');
        this.passInfoSuccess = true;
      } else
        console.log('Error enviando, intentelo de nuevo');

    }, (err) => {
      console.log(err, 'Error en el servidor, intentar luego');

    });
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

}
