import { ModalCancelPage } from './../modal-cancel/modal-cancel.page';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../src/app/services/auth.service'
import { ModalController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-detail-medic',
  templateUrl: './detail-medic.page.html',
  styleUrls: ['./detail-medic.page.scss'],
})
export class DetailMedicPage implements OnInit {

  medic: any;
  state: any;
  posponed: any;
  idPaciente: any;
  acceptedMeetings: any;
  newMeetings: any;
  postponedMeetings: any;
  modal: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    public mdlCtrl: ModalController,
    private dataService: DataService
    
  ) {
    this.medic = this.router.getCurrentNavigation().extras.state;
    
    this.state = this.route.snapshot.paramMap.get('state')
    this.posponed = this.route.snapshot.paramMap.get('posponed')
    console.log(this.posponed,'postponed');
    
    console.log(this.medic, this.state, this.posponed, 'data desde meetings');
    const idUser = JSON.parse(localStorage.getItem('user'));
    this.idPaciente = idUser.id;
    console.log(this.idPaciente, 'ID del paciente');
    this.getDataNews();
    this.getDataAccept();
    this.getDataPostponed();
  }

  ngOnInit() {
  }

  getDataNews() {
    let url = 'estadoCita=new,paciente_id=' + this.idPaciente;
    this.auth.getByUrlCustom(url).subscribe((result: any) => {
      this.newMeetings = result;
      console.log(this.newMeetings, 'Citas agendadas');
    })
  }

  getDataAccept() {
    let url = 'estadoCita=accepted,paciente_id=' + this.idPaciente;
    this.auth.getByUrlCustom(url).subscribe((result: any) => {
      this.acceptedMeetings = result;
      console.log(this.acceptedMeetings, 'Citas aceptadas');
    })
  }

  getDataPostponed() {
    let url = 'estadoCita=postponed,paciente_id=' + this.idPaciente;
    this.auth.getByUrlCustom(url).subscribe((result: any) => {
      this.postponedMeetings = result;
      console.log(this.postponedMeetings, 'Citas pospuestas');
    })
  }

  returnHome() {
    this.router.navigate(['home']);
  }

  async presentModal(dataCancel) {
    const modal = await this.mdlCtrl.create({
      component: ModalCancelPage,
      cssClass: 'css-modal',
      componentProps: {
        hour: dataCancel
      }

    });
    modal.onDidDismiss()
      .then((data) => {
        console.log(data, 'data del dismis modal ok');
        this.dataService.dataDelete = data
        console.log(this.dataService.dataDelete, 'data');
        this.router.navigate(['meetings'], {state:data} );
      });
    return await modal.present();
  }





}