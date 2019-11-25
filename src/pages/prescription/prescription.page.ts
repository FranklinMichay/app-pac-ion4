import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '../../app/services/loading.service';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.page.html',
  styleUrls: ['./prescription.page.scss'],
})
export class PrescriptionPage implements OnInit {

  dataUser: any;
  idPrescription: any;
  prescriptions: any;
  constructor(
    public mdlCtrl: ModalController,
    //navParams: NavParams,
    private modalCtrl: ModalController,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private router: Router,
    private loadingCtrl: LoadingService
  ) { }

  ngOnInit() {
    this.dataUser = JSON.parse(localStorage.getItem('user'));
    console.log(this.dataUser.id, 'id paciente');
    this.getIdMedicalHistory();
    
  }

  returnHome() {
    this.router.navigate(['home']);
  }

  getIdMedicalHistory() {
    this.auth.getIdMedicalHistory(this.dataUser.id).subscribe(result => {
      console.log(result, 'Mi Historial');
      this.idPrescription = result[0].id;
      console.log(this.idPrescription);
      this.getPrescription();
    }, (err) => {
      console.log(err, 'error historial');
    });
  }

  getPrescription() {
    this.loadingCtrl.presentLoading();
    this.auth.getPrescription(this.idPrescription).subscribe(result => {
      console.log(result, 'Recetas');
      this.prescriptions= result;
      this.loadingCtrl.dismiss();
    }, (err) => {
      console.log(err, 'error recetas');
      this.loadingCtrl.dismiss();
    });
  }

  goDetails(prescription) {
    this.router.navigate(['prescription-detail'],{ state: prescription });
  }

  

}
