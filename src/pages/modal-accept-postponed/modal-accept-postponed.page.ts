import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../app/services/loading.service';
import * as _ from 'lodash'; 

@Component({
  selector: 'app-modal-accept-postponed',
  templateUrl: './modal-accept-postponed.page.html',
  styleUrls: ['./modal-accept-postponed.page.scss'],
})
export class ModalAcceptPostponedPage implements OnInit {
  state = 'Disponible';
  hourAccept: any;
  constructor(
    navParams: NavParams,
    private modalCtrl: ModalController,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private router: Router,
    private loadingCtrl: LoadingService
  ) { 
    this.hourAccept = navParams.get('data');
    console.log(this.hourAccept, 'hora para aceptar');
  }

  ngOnInit() {
  }

  AcceptPosponed(idCita) {
    this.loadingCtrl.presentLoading();
    const _info = {
      id: idCita,
      estadoCita: 'accepted'
    };
    this.auth.update(_info).subscribe(result => {
      console.log(result, 'data Nueva');
      this.auth.sendNotify(result[0]);
      this.closeModal(idCita);
      this.loadingCtrl.dismiss();
    });
  }

  closeModal(idCita) {
    this.modalCtrl.dismiss({
      'data': idCita
    });
  }

}
