
import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-get-meeting',
  templateUrl: './get-meeting.page.html',
  styleUrls: ['./get-meeting.page.scss'],
})
export class GetMeetingPage implements OnInit {

  @Input() hour: any;
  idPaciente: any;
  namePatient: any;

  constructor(
    navParams: NavParams,
    private modalCtrl: ModalController
  ) { 
    console.log(navParams.get('hour'), 'DATOS EN EL MODAL');
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user, 'user from local storage');
    this.idPaciente = user ? user.pk : 1;
    this.namePatient = user ? user.nombre +  ' ' + user.apellido : 'Sin Nombre';
    const { pk } = this.hour.medic.id;
    const { hora , fecha, pkCentroMed } = this.hour;

    console.log(pk, hora, fecha , pkCentroMed, 'lo que trae');
    
  }

  ngOnInit() {
  }

  // sendRequest() {
    
  //   let fields: any = {}
  //   const { pk } = this.hour.medic;
  //   const { hora , fecha, pkCentroMed } = this.hour;
  //   fields.pkMedico = pk;
  //   fields.hora = hora;
  //   fields.fecha = fecha;
  //   fields.pkPaciente = this.pkPaciente;
  //   fields.pkCentroMed = pkCentroMed;
    
  //   let loading = this.loadingCtrl.create({spinner: 'crecent'});
  //   loading.present();
  //   this.restProvider.sendRequest(fields)
  //   .then((result) => {
  //     loading.dismiss();
  //     console.log(result, ' data from api');
  //     if (result['result'] === 'success') {
  //       this.restProvider.sendNotify({
  //         fecha: this.hour.fecha,
  //         client: this.pkPaciente,
  //         pkMedico: pk,
  //         data: fields.hora,
  //         clientName: this.namePatient,
  //         type: 'Cita Nueva' });
  //       this.goToMeetings();
  //     } else {
  //       let alert = this.toast.create({
  //         message: result['data_agenda'],
  //         duration: 3000,
  //         position: 'top'
  //       });
  //       alert.present();
  //     }
  //     this.cancel();
  //   }, (err) => {
  //     loading.dismiss();
  //     console.log(err, 'error from api');
  //     let alert = this.toast.create({
  //       message: err.message,
  //       duration: 3000,
  //       position: 'top'
  //     });
  //     alert.present();
  //     this.cancel();
  //   });
  // }

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
