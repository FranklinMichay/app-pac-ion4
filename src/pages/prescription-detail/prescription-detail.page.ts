import { DataService } from './../../app/services/data.service';
import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, NavParams } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import * as _ from 'lodash';

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

  constructor(
    //navParams: NavParams,
    private modalCtrl: ModalController,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private router: Router,
    private loadingCtrl: LoadingService,
    private route: ActivatedRoute,

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
      console.log(searchPrescription, 'dta trecet');
      this.prescriptions = searchPrescription;
      for (let index = 0; index < searchPrescription.length; index++) {
        this.datosMedico = this.auth.convertStringToArrayOfObjects(searchPrescription[index].datosMedico);
        this.datosPaciente = this.auth.convertStringToArrayOfObjects(searchPrescription[index].datosPaciente);
        this.dataIndicaciones = this.auth.convertStringToArrayOfObjects(searchPrescription[index].indicaciones);
        this.dataReceta = this.auth.convertStringToArrayOfObjects(searchPrescription[index].detalles);
        let datos = {
          datosMed:  this.datosMedico,
          datosPac:  this.datosPaciente,
          detalles: this.dataReceta,
          indicaciones: this.dataIndicaciones,
          fecha: new Date(searchPrescription[index].fecha),
          codRece: searchPrescription[index].codiRece,
        }
        this.dataMedic.push( datos  )
      }
      console.log(this.dataMedic, 'dataaaaa medicccc');

      // this.datosMedico = this.auth.convertStringToArrayOfObjects(searchPrescription.datosMedico);
      // console.log(this.datosMedico, 'dta medico');

      // this.datosPaciente = this.auth.convertStringToArrayOfObjects(searchPrescription.datosPaciente);
      // this.dataReceta = this.auth.convertStringToArrayOfObjects(searchPrescription.detalles);
      // this.idForRequest = this.removeSquareBracket(_.map(this.dataReceta, 'id'));
      // this.getInfoProductByListId(this.idForRequest);
      //this.dataIndicaciones = this.auth.convertStringToArrayOfObjects(searchPrescription.indicaciones);
      // console.log(result, 'Recetas');
      // this.prescriptions = result;
      this.loadingCtrl.dismiss();
    }, (err) => {
      console.log(err, 'error recetas');
      this.loadingCtrl.dismiss();
    });
  }

  goDetails(prescription) {
    this.router.navigate(['prescription'],{ state: prescription });
  }
}