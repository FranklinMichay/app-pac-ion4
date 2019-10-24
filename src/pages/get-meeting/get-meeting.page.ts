
import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../../src/app/services/auth.service'
import { Router } from '@angular/router';


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
    private loadingCrtl: LoadingController,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private router: Router,
  ) { 
    console.log(navParams.get('hour'), 'DATOS EN EL MODAL');
    this.dataHour = navParams.get('hour');
    // console.log(hor, 'hora lista');
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user, 'user from local storage');
    this.idPaciente = user ? user.id : 1;
    console.log(this.idPaciente, 'id user ');
    
    this.namePatient = user ? user.nombre +  ' ' + user.apellido : 'Sin Nombre';
    const idMed =  this.dataHour.medic.id;
    const {hora, fecha, idCentroMed, centroMedico, } =  this.dataHour;
    console.log( idMed, hora, fecha, idCentroMed, centroMedico, idMed ,'lo que trae de la hora');
    
  }

  ngOnInit() {
  }

  async presentLoading() {
    this.loading = await this.loadingCrtl.create({
      spinner: 'crescent',
      message: 'Obteniendo Datos...',
    });
    return await this.loading.present();
  }

  sendRequest() {
    
    let fields: any = {}
    const idMed =  this.dataHour.medic.id;
    const {hora, fecha, idCentroMed, } =  this.dataHour;
    fields.medico = idMed;
    fields.hora = hora;
    fields.fecha = fecha;
    fields.paciente = this.idPaciente;
    fields.centroMedico = idCentroMed;
    fields.estadoCita = 'new';
    fields.estadoAgenda = 'available';

    console.log(fields, 'datos para enviar a agendar');
    this.presentLoading();
    this.auth.create(fields).subscribe(result=> {
      console.log(result, 'data agendar cita');
      this.loading.dismiss();
      this.presentAlertConfirm();
      //this.dismiss();
    });
  }

  // async presentAlert() {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Correcto',
  //     subHeader: 'Pedido Enviado',
  //     message: 'Que hacer',
  //     buttons: ['Quedarme Aqui', 'Ir a mis Citas']
  //   });

  //   await alert.present();
  // }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Message <strong>text</strong>!!!',
      buttons: [
        {
          text: 'Ir a mis Citas',
          handler: () => {
            this.router.navigate(['meetings']);
            this.dismiss();
            console.log('Ir a mis Citas');
          }
        }, {
          text: 'Quedarme Aqui',
          handler: () => {
            this.dismiss();
            console.log('Quedarme Aqui');
          }
        }
      ]
    });

    await alert.present();
  }

  // goToMeetings() {
  //   let alert = this.alertCtrl.create({
  //     title: 'PEDIDO ENVIADO',
  //     buttons: [
  //       {
  //         text: 'Quedarme Aqui',
  //         role: 'cancel',
  //         handler: () => {
  //           this.cancel();
  //         }
  //       },
  //       {
  //         text: 'Ir a Mis Citas',
  //         handler: () => {
  //           this.cancel();
  //           this.navCtrl.push(MeetingsPage);
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }



  dismiss() {
    
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }


 

}
