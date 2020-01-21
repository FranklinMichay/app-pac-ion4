import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../app/services/loading.service';
import * as _ from 'lodash';

import { MeetingsPage } from '../../pages/meetings/meetings.page';

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

  AcceptPosponed(horaAccept) {
    this.loadingCtrl.presentLoading();
    const _info = {
      id: horaAccept.id,
      estadoCita: 'accepted'
    };
    console.log(horaAccept.id, 'ide para aceptar');
    this.auth.update(_info).subscribe(result => {
      console.log(result, 'data Nueva');
      this.auth.sendNotify(result[0]);
      this.closeModal(horaAccept);
      this.loadingCtrl.dismiss();
    });
  }

  closeModal(horaAccept) {
    this.modalCtrl.dismiss({
      'data': horaAccept
    });
  }
}
