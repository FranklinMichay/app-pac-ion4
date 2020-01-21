import { element } from 'protractor';
import { Event } from './../../shared/model/event';
import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../app/services/loading.service';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import * as _ from 'lodash';
import { DataService } from 'src/app/services/data.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.page.html',
  styleUrls: ['./prescription.page.scss'],
})
export class PrescriptionPage implements OnInit {

  //logica

  dataPrescription: any[];
  dataReceta: any = {};
  listDetails: any;
  idForRequest: any;
  listProducts: any = [];
  dataForView = [];
  dataDispatch = [];
  total: any;
  data: any;
  prescription: any;
  addDetails: any;

  dispatchControl = false;

  quantitySelect = 0;
  iva = 0.12;

  /* DESPACHOS POR RECETA */
  dispatchs: any[];

  medicineTab = true;
  dispatchTab = false;
  cdRef: any;
  valor: any;
  ctrlView: boolean = true;
  

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
    this.exportData(this.dataService.dataCompra);

  }

  goCart() {
    console.log('algo');
    this.router.navigate(['cart']);
    
    
  }

  getMax() {
    if (this.valor >= 100) {
      console.log('numero mayor a 100');
    } else {
      console.log('menor a 100');
    }
  }

  getInfoProductByListId(ids: any) {
    console.log(ids, 'IDS JUANITO');

    this.auth.getInfoProducts(ids).subscribe((resultGetInfoProducts: any) => {
      console.log(resultGetInfoProducts, 'PORDUCOTS');
      this.listProducts = resultGetInfoProducts;
      this.processDataInfoProducts();
    });
  }

  getDispatchService(id: any) {
    this.auth.getDesp(id).subscribe((resultDispatch: any) => {
      console.log(resultDispatch, 'DESPACHOS');
      this.dispatchs = resultDispatch;
      this.addDetails = this.addDispatchPrescription();
      this.getInfoProductByListId(this.idForRequest);
    });
  }

  // LOGICA 

  exportData(event) {
    console.log(event, 'receag');

    this.data = { index: null, product: '', totalPrescription: 0, remaining: null, totalDispatch: 0, price: null, subtotal: null };
    this.dataForView = [];
    this.total = null;
    this.prescription = event;
    this.listDetails = event.detalles;
    this.idForRequest = this.removeSquareBracket(_.map(this.listDetails, 'id'));
    this.getDispatchService(event.codiRece);
  }

  saveDataforDispatch() {
    const details = [];
    console.log(this.listProducts[0]);
    const products = this.listProducts;

    this.dataForView.map(function (element) {
      let dataPush = { id: products[element.index]._id, cantidad: parseInt(element.totalDispatch, 10) };
      details.push(dataPush);
    });
    this.dataForView.push(this.prescription);
    sessionStorage.setItem('paymentPrescription', JSON.stringify(this.dataForView));
    const dataForDispatch = {
      idReceta: this.prescription.codiRece,
      datosReceta: this.prescription._id,
      detalles: JSON.stringify(details),
      fecha: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      totalDespacho: this.calculateTotalDispatch(),
      horarioEntrega: 'mañana',

    };

    this.router.navigate(['pagoReceta']);

    //this.createDispatchService(dataForDispatch);


  }

  addDispatchPrescription() {
    let resultAdd = null;
    let allDetails = [];
    this.dispatchs.map((elementMap: any) => {
      console.log(this.auth.convertStringToArrayOfObjects(elementMap.detalles));

      allDetails = this.concatDetailsDispatch(this.auth.convertStringToArrayOfObjects(elementMap.detalles), allDetails);
    });
    resultAdd = this.addListById(allDetails);
    return resultAdd;
  }
  /* CONCATENA DOS LISTAS */
  concatDetailsDispatch(list1: any, list2: any) {
    return _.concat(list2, list1);
  }
  /* SUMA DE CANTIDADES */
  addListById(data: any) {
    const summary = _.chain(data).reduce(function (acc, i) {
      if (i.cantidad > 0) {
        acc[i.id] = (acc[i.id] || 0) + i.cantidad;
      }
      return acc;
    }, {}).toPairs().map(function (x) {
      var tmp: any = {};
      tmp.id = x[0];
      tmp.cantidad = x[1];
      return tmp;
    }).value();
    return summary;
  }

  buyTotalPrescription() {
    this.dataForView.map((elemn: any) => {
      elemn.totalDispatch = elemn.remaining;
    });
    this.dataForView.map((elemn: any) => {
      let subC = elemn.totalDispatch * elemn.price;
      elemn.subtotal = subC.toFixed(2);;
      elemn.totalDispatch = elemn.remaining;
    });
    this.total = this.dataForView.reduce((
      acc,
      obj,
    ) => acc + (obj.totalDispatch * obj.price),
      0);
    this.total = parseFloat(this.total).toFixed(2);
    this.calculateTotalDispatch();
    this.router.navigate(['cart'], { state: this.dataForView });
  }

  // ionViewDidLeave() {
   
  // }

  // ionViewWillEnter() {
  //   this.dataForView= []
  //   console.log(this.dataForView, 'ESTADO DE DATA FOR VIEW');
    
  // }

  /************************************* FUNCIONES DE PROCESOS **************************************/

  calculateTotal(event, index) {
    //console.log(parseInt(this.dataForView[index].remaining, 10),event.target.value, 'datos compare' );
    if (event.target.value < 0) {
      event.target.value = 0;
      this.dataForView[index].totalDispatch = 0;
    }
    if (parseInt(this.dataForView[index].remaining, 10) < event.target.value) {
      console.log(parseInt(this.dataForView[index].remaining, 10),event.target.value, 'datos compare' );
      
      event.target.value = this.dataForView[index].remaining;
      this.dataForView[index].totalDispatch = event.target.value;
    }
    let subC = this.dataForView[index].totalDispatch * this.dataForView[index].price;
    this.dataForView[index].subtotal = subC.toFixed(2);
    this.total = this.dataForView.reduce((
      acc,
      obj,
    ) => acc + (obj.totalDispatch * obj.price),
      0);
    this.total = parseFloat(this.total).toFixed(2);
    console.log(this.total, 'total despacho');
    console.log(this.dataForView, 'tl despao');
    
    
    this.calculateTotalDispatch();
  }

  addToCart() {
    this.dataService.cart = this.dataForView;
    console.log(this.dataService.cart, 'datos en service');
  }

  processDataInfoProducts() {
    this.dataForView = [];
    const quantityOfProducts = _.map(this.listDetails, 'cantidad');
    const priceProduct = _.map(this.listProducts, 'precioDistribucion');
    console.log(this.listProducts);

    this.data = { index: null, product: '', totalPrescription: 0, remaining: null, totalDispatch: 0, price: null, subtotal: null };
    let i = 0;
    for (const elemnt of this.listProducts) {
      this.data.index = i;
      this.data._id = elemnt._id;
      this.data.product = this.listProducts[i].codigoProducto.nombre;
      this.data.pharmacyForm = this.listProducts[i].codigoProducto.formaFarmaceutica;
      this.data.concentration = this.listProducts[i].codigoProducto.concentracion;
      this.data.presentation = this.listProducts[i].codigoProducto.presentacion;
      this.data.totalPrescription = quantityOfProducts[i];
      let quant = this.extractDataById(this.addDetails, elemnt._id);
      if (quant.length === 0) {
        this.data.remaining = quantityOfProducts[i];
      } else {
        this.data.remaining = (quantityOfProducts[i] - quant[0].cantidad);
      }
      this.data.price = priceProduct[i];
      this.dataForView.push(this.data);
      this.data = { index: null, product: '', totalPrescription: '', remaining: null, totalDispatch: 0, price: null, subtotal: null };
      i++;
    }
    console.log(this.dataForView, 'DATA DESPACHO PROCESADO');

    this.verifyRemaining();
  }

  processDataDispatch() {
    const dataDist = [];
    this.listProducts.map((result: any) => {
      let dataResult: any = {};
      dataResult.product = result.codigoProducto.nombre;
      let array = [];
      this.dispatchs.map((elemn: any) => {
        let quant = this.extractDataById(this.auth.convertStringToArrayOfObjects(elemn.detalles), result._id);
        quant.map((resQ: any) => {
          array.push(resQ.cantidad);
        });
      });
      dataResult.price = result.precioDistribucion;
      console.log('cantidad', array);
      dataResult.dispatch = array;
      dataDist.push(dataResult);
    });
    this.dataDispatch = dataDist;
    console.log(dataDist, 'NUEVO DESPACHO');

  }

  processQuantityProduct(index: any) {
    let dat = this.dispatchs[index];
    dat.detalles = this.auth.convertStringToArrayOfObjects(dat.detalles);

    let i = 0;
    let bandR = false;
    for (const object of dat.detalles) {
      if (object.cantidad === 65) {
        bandR = true;
      }

      i++;
    }
  }
  /*  processDataDispatch() {
    const dataDist = [];
    this.dispatchs.map((result: any) => {
      let data: any = {};
      let detalles = [];
      let detail = [];
      data.fecha = result.fecha;
      data.totalDespacho = result.totalDespacho;
      data.horarioEntrega = result.horarioEntrega;
      detail = this.auth.convertStringToArrayOfObjects(result.detalles);
      detail.map((detailResult: any) => {
        let deta: any = {};
        console.log(detailResult.id);
        let prod = this.extractDataBy_Id(this.listProducts, detailResult.id);
        deta.product = prod[0];
        deta.cantidad = detailResult.cantidad;
        detalles.push(deta);
      });
      data.detalles = detalles;
      dataDist.push(data);
    });
    this.dataDispatch = dataDist;
    console.log(this.dataDispatch);
    
  }  */

  removeSquareBracket(array: []) {
    let resultRemove = '';
    array.map(function (elememnt: any) {
      resultRemove += `${elememnt},`;
    });
    return (resultRemove.slice(0, (resultRemove.length - 1)));
  }

  extractDataById(data, id) {
    return _.filter(data, function (ob) { return ob.id === id; });
  }
  extractDataBy_Id(data, id) {
    return _.filter(data, function (ob) { return ob._id === id; });
  }

  /* FUNCIONES CONTROL */
  verifyRemaining() {
    let band = true;
    this.dataForView.map((object: any) => {
      if (object.remaining > 0) {
        band = false;
      }

    });

    return band;
  }

  calculateTotalDispatch() {
    const sub = this.total * this.iva;
    const result = parseFloat(this.total) + sub;
    return result.toFixed(2);
  }

}