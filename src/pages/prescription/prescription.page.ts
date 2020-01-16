import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../app/services/loading.service';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import * as _ from 'lodash';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.page.html',
  styleUrls: ['./prescription.page.scss'],
})
export class PrescriptionPage implements OnInit {

  dataUser: any;
  idPrescription: any;
  prescriptions: any;
  dataReceta: any;

  dataDespacho: any;
  idForRequest: any;
  dataForView: any;
  listProducts: any = [];
  dataListDesp: any = [];
  dataCompra: any;

  cantidad: any;
 
  constructor(
    public mdlCtrl: ModalController,
    //navParams: NavParams,
    private modalCtrl: ModalController,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private router: Router,
    private loadingCtrl: LoadingService,
    private route: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataReceta = this.router.getCurrentNavigation().extras.state;
    console.log(this.dataReceta, 'PRODUCTOS');
    this.dataCompra = this.dataService.dataCompra;
    console.log(this.dataCompra, 'RECETA');
    
    //this.getDesp();
  }

  returnHome() {
    this.router.navigate(['home']);
  }

  goDetails(prescription) {
    this.router.navigate(['prescription-detail'], { state: prescription });
  }

  getDesp() {
    this.loadingCtrl.presentLoading();
    this.auth.getDesp(this.dataReceta.codRece).subscribe(searchPrescription => {
      for (let index = 0; index < searchPrescription.length; index++) {
        this.dataDespacho = this.auth.convertStringToArrayOfObjects(searchPrescription[index].datosReceta.detalles);
        let datos = {
          fecha: new Date(searchPrescription[index].fecha),
          idReceta: searchPrescription[index].idReceta,
          totalDesp: searchPrescription[index].totalDespacho,
          datosReceta: this.dataDespacho,
        }
        this.dataListDesp.push(datos)
      }
      console.log(this.dataReceta, 'data receta');
      console.log(this.dataReceta.detalles, 'dataReceta detalles');

      this.idForRequest = this.removeSquareBracket(_.map(this.dataReceta.detalles, 'id'));
      this.auth.getInfoProducts(this.idForRequest).subscribe((resultGetInfoProducts: any) => {
        this.dataForView = resultGetInfoProducts;
        if (this.dataDespacho) {
          this.dataDespacho.map((item, index) => {
            if (item.id == this.dataForView[index]._id) {
              this.dataListDesp[index].detalles = this.dataForView[index];
            }
          });
        }
        console.log(this.dataListDesp, 'despachos formateados ');
      });
      this.loadingCtrl.dismiss();
    }, (err) => {
      console.log(err, 'error despachos');
      this.loadingCtrl.dismiss();
    });
  }

  getInfoProductByListId(ids: any) {
    this.auth.getInfoProducts(ids).subscribe((resultGetInfoProducts: any) => {
      this.dataForView = resultGetInfoProducts;
    });
  }

  removeSquareBracket(array: []) {
    let resultRemove = '';
    array.map(function (elememnt: any) {
      resultRemove += `${elememnt},`;
    });
    return (resultRemove.slice(0, (resultRemove.length - 1)));
  }

}
