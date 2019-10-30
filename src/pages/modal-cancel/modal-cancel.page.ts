import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../app/services/loading.service';
import * as _ from 'lodash'; 

@Component({
  selector: 'app-modal-cancel',
  templateUrl: './modal-cancel.page.html',
  styleUrls: ['./modal-cancel.page.scss'],
})
export class ModalCancelPage implements OnInit {

  @Input() hour: any;
  hourCancel: any;
  state = 'Disponible';

  constructor(
    navParams: NavParams,
    private modalCtrl: ModalController,
    //private loadingCrtl: LoadingController,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private router: Router,
    private loadingCtrl: LoadingService
  ) {
    this.hourCancel = navParams.get('hour');
    console.log(this.hourCancel, 'hora para cancelar');

  }

  ngOnInit() {
  }

  cancelAppointment(dataCita) {
    this.loadingCtrl.presentLoading();
    const _info = {

      id: dataCita.id,
      hora: dataCita.hora,
      fecha: dataCita.fecha,
      medico_id: dataCita.medico.id,
      centroMedico_id: dataCita.medico.centroMedico[0].id,
      origin: 'canceledByPatient',
      estadoCita: 'canceled'
      
    };
    this.auth.partialUpdate(_info).subscribe(result => {
      console.log(result, 'resul de la eliminacion');
      this.closeModal(dataCita);
      //this.router.navigate(['meetings'] );
      this.loadingCtrl.dismiss();
    });
  }

  closeModal(dataCita) {
    this.modalCtrl.dismiss({
      'data': dataCita
    });
  }

}
