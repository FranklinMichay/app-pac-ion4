import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

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
    private loadingCrtl: LoadingController,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private router: Router,
  ) {
    this.hourCancel = navParams.get('hour');
    console.log(this.hourCancel, 'hora para cancelar');

  }

  ngOnInit() {
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
