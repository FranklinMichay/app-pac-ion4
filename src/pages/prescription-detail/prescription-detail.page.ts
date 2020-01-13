import { DataService } from './../../app/services/data.service';
import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, NavParams } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import * as _ from 'lodash';
import { SearchFilterPage } from './../search-filter/search-filter.page';


@Component({
  selector: 'app-prescription-detail',
  templateUrl: './prescription-detail.page.html',
  styleUrls: ['./prescription-detail.page.scss'],
})
export class PrescriptionDetailPage implements OnInit {

  //dataReceta: any;
  currentTab: string = 'step1';
  dni: any;
  prescriptions: any;
  dataUser: any;
  dataMedic: any = [];
  datosMedico: any = {};
  datosPaciente: any = {};
  dataReceta: any = [];
  dataIndicaciones: any = [];
  idForRequest: any;
  listProducts: any = [];
  dataForView: any = [];
  prescription: any;
  prescriptionList: any;

  constructor(
    //navParams: NavParams,
    private modalCtrl: ModalController,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private router: Router,
    private loadingCtrl: LoadingService,
    private route: ActivatedRoute,
    public mdlCtrl: ModalController,

  ) {
    //this.dataReceta = navParams.get('receta');
    // this.dataReceta = this.router.getCurrentNavigation().extras.state;
    // console.log(this.dataReceta,'recetaaa');

  }

  ngOnInit() {

    this.dataUser = JSON.parse(localStorage.getItem('user'));
    this.dni = this.dataUser.identificacion;
    console.log(this.dni, 'cedula paciente');
    // console.log(this.dataReceta, 'data receta');
   this.getPrescription();
  }

  returnHome() {
    this.router.navigate(['home']);
  }

  changeTab(tab: string) {
    this.currentTab = tab;
    if (tab === 'step1') {
    }
    if (tab === 'step2') {
      console.log(tab, 'tab');

    }
  }

  getPrescription() {

    this.loadingCtrl.presentLoading();
    this.auth.getPrescription(this.dni).subscribe(searchPrescription => {
      console.log(searchPrescription, 'Recetas');
      this.prescriptions = searchPrescription;
      for (let index = 0; index < searchPrescription.length; index++) {
        this.datosMedico = JSON.parse(searchPrescription[index].datosMedico);
        this.datosPaciente = JSON.parse(searchPrescription[index].datosPaciente);
        this.dataIndicaciones = JSON.parse(searchPrescription[index].indicaciones);
        this.dataReceta = JSON.parse(searchPrescription[index].detalles);
        // this.datosMedico = this.auth.convertStringToArrayOfObjects(searchPrescription[index].datosMedico);
        // this.datosPaciente = this.auth.convertStringToArrayOfObjects(searchPrescription[index].datosPaciente);
        // this.dataIndicaciones = this.auth.convertStringToArrayOfObjects(searchPrescription[index].indicaciones);
        // this.dataReceta = this.auth.convertStringToArrayOfObjects(searchPrescription[index].detalles);
        let datos = {
          datosMed:  this.datosMedico,
          datosPac:  this.datosPaciente,
          detalles: this.dataReceta,
          indicaciones: this.dataIndicaciones,
          fecha: searchPrescription[index].fecha,
          codRece: searchPrescription[index].codiRece,
        }
        this.dataMedic.push( datos  )
      }

      console.log(this.dataMedic, 'recetas format');
      
      this.idForRequest = this.removeSquareBracket(_.map(this.dataMedic.detalles, 'id'));
      console.log(this.idForRequest, 'ids para la consulta');
      this.auth.getInfoPrescription(this.idForRequest).subscribe((resultGetInfoProducts: any) => {
        this.dataForView = resultGetInfoProducts;
        if (this.dataReceta) {
          this.dataReceta.map((item, index) => {
            if (item.id == this.dataForView[index]._id) {
              this.prescriptionList[index].detalles = this.dataForView[index];
            }
          });
        }
        console.log(this.prescriptionList, 'recetas formateados ');
      });
      
      this.loadingCtrl.dismiss();
    }, (err) => {
      console.log(err, 'error recetas');

      this.loadingCtrl.dismiss();
    });
  }

  removeSquareBracket(array: []) {
    let resultRemove = '';
    array.map(function (elememnt: any) {
      resultRemove += `${elememnt},`;
    });
    return (resultRemove.slice(0, (resultRemove.length - 1)));
  }

  goDetails(prescription) {
    this.router.navigate(['prescription'],{ state: prescription });
  }

  goDetailAppointment(prescription) {
    this.prescription = prescription;
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.mdlCtrl.create({
      component: SearchFilterPage,
      cssClass: 'css-modal',
      componentProps: {
        prescription: this.prescription
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        console.log(data, 'appointment del modal dismiss');
        
      });
    return await modal.present();
  }
}