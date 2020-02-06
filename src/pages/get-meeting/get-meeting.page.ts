
import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../../src/app/services/auth.service'
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';


@Component({
  selector: 'app-get-meeting',
  templateUrl: './get-meeting.page.html',
  styleUrls: ['./get-meeting.page.scss'],
})
export class GetMeetingPage implements OnInit {

  @Input() hour: any;

  idPaciente: any;
  namePatient: any;
  dataHour: any;
  loading: any;

  constructor(
    navParams: NavParams,
    private modalCtrl: ModalController,
    //private loadingCrtl: LoadingController,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private router: Router,
    private loadingCtrl: LoadingService 
  ) {
    console.log(navParams.get('hour'), 'DATOS EN EL MODAL');
    this.dataHour = navParams.get('hour');
    // console.log(hor, 'hora lista');
    const user = JSON.parse(localStorage.getItem('userPaciente'));
    console.log(user, 'user from local storage');
    this.idPaciente = user ? user.id : 1;
    console.log(this.idPaciente, 'id user ');

    this.namePatient = user ? user.nombre + ' ' + user.apellido : 'Sin Nombre';
    const idMed = this.dataHour.medic.id;
    const { hora, fecha, idCentroMed, centroMedico, } = this.dataHour;
    console.log(idMed, hora, fecha, idCentroMed, centroMedico, idMed, 'lo que trae de la hora');

  }

  ngOnInit() {
  }

  sendRequest() {

    let fields: any = {}
    const idMed = this.dataHour.medic.id;
    const { hora, fecha, idCentroMed, } = this.dataHour;
    fields.medico_id = idMed;
    fields.hora = hora;
    fields.fecha = fecha;
    fields.paciente_id = this.idPaciente;
    fields.centroMedico_id = idCentroMed;
    fields.estadoCita = 'new';
    fields.estadoAgenda = 'available';
    console.log(fields, 'datos para enviar a agendar');
    this.loadingCtrl.presentLoading();
    this.auth.create(fields).subscribe(result => {
      console.log(result, 'data agendar cita');
      this.loadingCtrl.dismiss();
      this.presentAlertConfirm();
      this.auth.sendNotify(result[0]);
      this.closeModal(this.dataHour);
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Listo, tu cita se agendó con éxito',
      message: 'Que hacer ahora?',
      buttons: [
        {
          text: 'Ir a mis Citas',
          handler: () => {
            this.router.navigate(['meetings']);
            console.log('Ir a mis Citas');
          }
        }, {
          text: 'Quedarme Aqui',
          handler: () => {
            console.log('Quedarme Aqui');
          }
        }
      ]
    });

    await alert.present();
  }

  closeModal(data) {
    this.modalCtrl.dismiss({
      'data': data
    });
  }

}
