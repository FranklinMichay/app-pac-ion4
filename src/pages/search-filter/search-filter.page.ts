import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.page.html',
  styleUrls: ['./search-filter.page.scss'],
})
export class SearchFilterPage implements OnInit {

  medic: any;
  specilities: any;
  medicalCenter: any;
  medicsByCity: any;
  medicalC: any;
  prescription: any;
  idForRequest: any;
  dataForView: any;
  dataReceta: any;
  prescriptionList: any = [];

  constructor(
    navParams: NavParams,
    private modalCtrl: ModalController,
    private auth: AuthService,
    private loadingCtrl: LoadingService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
  ) {
    this.prescription = navParams.get('prescription');
    console.log(this.prescription, 'PRODUCTOS EN MODAL');
    this.dataReceta = navParams.get('dataReceta');
    console.log(this.dataReceta, 'DATOS DE RECETA EN MODAL');
    //this.getInventarioById();

  }

  ngOnInit() {
  }

  closeModal() {
    this.modalCtrl.dismiss({
      // 'data': dataCita
    });
  }

  getInventarioById() {
    this.loadingCtrl.presentLoading();
    this.idForRequest = this.removeSquareBracket(_.map(this.prescription.detalles, 'id'));
    console.log(this.idForRequest, 'ids para consulta');

    this.auth.getInfoProducts(this.idForRequest).subscribe((resultGetInfoProducts: any) => {
      this.dataForView = resultGetInfoProducts;
      if (this.prescription) {
        this.prescription.map((item, index) => {
          if (item.id == this.dataForView[index]._id) {
            this.prescription[index].dataProduct = this.dataForView[index];
          }
        });
      }
      console.log(this.prescription, 'NUEVA DATA');
      this.loadingCtrl.dismiss();
    }, (err) => {
      console.log(err, 'error data inventario');
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


  getSpecialities() {
    this.loadingCtrl.presentLoading();
    let url = 'administracion/especialidad';
    this.auth.getDataByUrlCustom(url).subscribe((result: any) => {
      console.log(result, 'especialidades');
      this.specilities = result;
      this.loadingCtrl.dismiss();
    }, (err) => {
      console.log(err, 'errores');
    });
  }

  getMedicalCenter() {
    this.loadingCtrl.presentLoading();
    let url = 'administracion/centroMedico';
    this.auth.getDataByUrlCustom(url).subscribe((result: any) => {
      console.log(result, 'centros medicos');
      this.medicalCenter = result;
      this.loadingCtrl.dismiss();
    }, (err) => {
      console.log(err, 'errores');
    });
  }

  codeSelected() {
    console.log(this.medicalC, 'dta del select');

  }

  goDetails(prescription) {
    this.loadingCtrl.presentLoading();
    this.dataService.dataCompra = prescription;
    this.getProductPrescriptionCompra(this.removeSquareBracket(_.map(prescription.detalles, 'id')));
    this.loadingCtrl.dismiss();
  }

  getProductPrescriptionCompra(ids: string) {
    this.loadingCtrl.presentLoading();
    this.auth.getInfoProducts(ids).subscribe(prescription => {
      this.prescriptionList = prescription;
      this.router.navigate(['prescription'], { state: this.prescriptionList } );
    });
    this.loadingCtrl.dismiss();
    this.close();
  }

  close() {
    this.modalCtrl.dismiss({
      // 'data': dataCita
    });
  }
}
