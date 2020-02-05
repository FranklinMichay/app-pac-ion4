import { Component, OnInit, ViewChild, ElementRef, ɵEMPTY_MAP } from '@angular/core';
import * as $ from 'jquery';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IonSlides, ToastController } from '@ionic/angular';
// import * as $ from '@types/jquery';
// import * as postscribe from 'postscribe';
import { UbicacionService } from '../../app/services/ubicacion.service';
declare var Paymentez: any;
declare var PaymentezCheckout: any;
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { faCreditCard, faMoneyCheckAlt, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { ToastService } from '../../app/services/toast.service';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Options } from '../../shared/mock/option-pay';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  faCreditCard = faCreditCard;
  faMoneyCheckAlt = faMoneyCheckAlt;
  faMoneyBill = faMoneyBill;
  metodoPago: any
  selectMetodo = false;

  isDatosPersonales = false;
  isDireccion: boolean;
  isPago = false;
  marker: any;
  cboxPoliticas = false;
  currentTab: string = 'step1';
  className: string = 'one-class';
  options: any;
  cards: any;
  active: any;
  activeCard: any;
  isCard = false;
  isContraEntrega = false;
  dataForView: any;
  prescription:any;
  total:  any;
  iva = 0.12;

  myForm: FormGroup;
  formData = new FormData();
  public datosPersonalesFrom: FormGroup;
  public direccionForm: FormGroup;
  public submitAttempt: boolean = false;

  @ViewChild('map', { static: false }) mapElement: ElementRef;

  mapbox = (mapboxgl as typeof mapboxgl);
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  // Coordenadas de la localización donde queremos centrar el mapa
  lat = -4.0075088;
  lng = -79.2434842;
  zoom = 13;
  user: any;

  sliderConfig = {
    slidesPerView: 2,
    spaceBetween: 3,
    centeredSlides: true
  };

  constructor(
    public fb: FormBuilder,
    public geolocation: Geolocation,
    public toast: ToastService,
    private dataService: DataService,
    private router: Router,
    public toastController: ToastController,
    private auth: AuthService,
  ) {
    //this.isDatosPersonales = true;
    this.options = Options.options;
    this.cards = Options.cards;
    this.isDireccion = true;
    this.user = JSON.parse(localStorage.getItem('user'));

  }

  ngOnInit() {

    this.initForms();
  }

  changeTab(tab: string) {
    this.currentTab = tab;
    if (tab === 'step1') {
    }
    if (tab === 'step2') {
    }
  }

  ionViewDidEnter() {
    this.getCurrentPosition();
  }

  getCurrentPosition() {
    this.geolocation.getCurrentPosition().then((coordinates) => {
      console.log('getCurrentPosition', coordinates);
      this.lat = coordinates.coords.latitude;
      this.lng = coordinates.coords.longitude;
      this.loadMap();
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  loadMap() {
    this.mapbox.accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.lng, this.lat],
      zoom: 15
    });
    this.addMarker();

    this.map.on('move', () => {
      console.log(`Current Map Center: ${this.map.getCenter()}`);
      const centerMap = this.map.getCenter();
      this.marker.setLngLat([centerMap.lng, centerMap.lat])
        .addTo(this.map);
    });
  }

  addMarker() {
    let el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = "url('assets/markers/location.png')";
    el.style.backgroundSize = 'cover';
    el.style.width = '40px';
    el.style.height = '40px';

    let centerMap = this.map.getCenter();
    this.marker = new mapboxgl.Marker(el, {
      draggable: false
    }).setLngLat([centerMap.lng, centerMap.lat])
      .addTo(this.map);
  }


  initForms() {

    this.direccionForm = this.fb.group({
      callePrincipal: [this.user.callePrincipal, Validators.required],
      calleSecundaria: [this.user.calleSecundaria,  Validators.required],
      ciudad: [this.user.ciudad, Validators.required],
      numCasa: [this.user.numCasa, Validators.required],
      referencia: [this.user.referencia,Validators.required],
      longitud: [''],
      latitud: [''],
    });

    this.datosPersonalesFrom = this.fb.group({
      nombres: [this.user.priNombre, Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      apellidos: [this.user.priApellido, Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      telefono: [this.user.telefonoCelular, Validators.compose([Validators.maxLength(30), Validators.pattern('[0-9]*'), Validators.required])],
      email: [this.user.user.username, [Validators.email, Validators.required]],
      identificacion: [this.user.identificacion, Validators.compose([Validators.required, Validators.pattern('^(?:[0-9]{10},)*[0-9]{10}$')])],
    });
  }

  goDireccion() {
    this.isDatosPersonales = false;
    this.isDireccion = true;
    this.changeTab('step1');
  }

  gotoPagos() {
    this.isDatosPersonales = true
    this.isDireccion = false;
    this.isPago = false;
  }

  goData() {
    this.isDatosPersonales = true
    this.isDireccion = false;
    this.isPago = false;
    this.changeTab('step2');
  }

  goFac() {
    this.isDatosPersonales = true;
    this.isDireccion = false;
    this.isPago = false;
    this.changeTab('step2');
  }

  goPayInformation() {
    this.isDatosPersonales = false
    this.isDireccion = false;
    this.isPago = true;
  }

  next() {

  }

  goDatos() {
    this.isDatosPersonales = false;
    this.isDireccion = false;
    this.isPago = true;
    this.changeTab('step3');
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Transacción exitosa',
      duration: 2000,
      color: 'dark'
    });
    toast.present();
  }

  save() {
    this.submitAttempt = true;
    if (!this.datosPersonalesFrom.valid) {
      // this.slider.slideTo(0);
    }
    else if (!this.direccionForm.valid) {
      // this.slider.slideTo(1);
    }
    else {
      console.log("success!")
      console.log(this.datosPersonalesFrom.value);
      console.log(this.direccionForm.value);
    }
  }

  selectmetodo() {
    this.selectMetodo = true;
    console.log(this.selectMetodo);
  }

  updateActive(category){
    console.log(category, 'categoria selccionada');
    this.active = category;
    if(category.name === 'TARJETA') {
      this.isCard = true;
      this.isContraEntrega = false;
    }else{
      this.isCard = false;
      this.isContraEntrega = true;
    }
  }

  updateActiveCard(card){
    this.activeCard = card;
  }

  goPay() {
    this.dataForView = this.dataService.dataForPay;
    this.prescription = this.dataService.dataCompra;
    console.log(this.dataForView, 'data forview');
    this.dataForView.push(this.prescription);
    console.log(this.dataForView, 'data para guardar');
    this.createCartP({ identiPac: this.user.identificacion, compra: this.dataForView });
  }

  createCartP(data) {
    this.auth.createCart(data).subscribe(() => {
      this.presentToast();
      this.router.navigate(['home']);
    });
  }

  save1(pago){
    console.log(pago, 'tipopago');
    
  }

  // saveDispatch(statePayment: any) {
   
  //   const details = [];
  //   let estadoPagoV = '';
  //   let formaPagoV = '';
  //   this.direccionForm.controls['longitud'].setValue(this.lng);
  //   this.direccionForm.controls['latitud'].setValue(this.lat);
  //   if (statePayment === 'contraPedido') {
  //     estadoPagoV = 'impago';
  //     formaPagoV = 'contraPedido';
  //   }
  //   this.dataForView.map(function (element) {
  //     let dataPush = { id: element._id, cantidad: parseInt(element.totalDispatch, 10) };
  //     details.push(dataPush);
  //   });
  //   const dataForDispatch = {
  //     idReceta: this.prescription.codiRece,
  //     datosReceta: this.prescription._id,
  //     detalles: JSON.stringify(details),
  //     fecha: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
  //     totalDespacho: this.calculateTotalDispatch(),
  //     //horarioEntrega: this.secondFormGroup.controls['horarioEntrega'].value,
  //     datosFactura: this.datosPersonalesFrom.value,
  //     datosEntrega: this.direccionForm.value,
  //     estadoPago: estadoPagoV,
  //     formaPago: formaPagoV
  //   };
  //   this.createDispatchService(dataForDispatch);
  // }

  // calculateTotalDispatch() {
  //   const sub = this.total * this.iva;
  //   const result = parseFloat(this.total) + sub;
  //   return result.toFixed(2);
  // }

  // createDispatchService(data: any) {
  //   this.mongo.createDispatch(data).subscribe((resultCreate: any) => {
  //     console.log('Despacvho Guardado');
  //     this.exportData(this.prescription);
      
  //     // this.deleteCartPatient(this.userData.identificacion);
  //   });
  // }

  // exportData(event) {
  //   this.data = { index: null, product: '', totalPrescription: '', remaining: null, totalDispatch: 0, price: null, subtotal: null };
  //   this.dataForView = [];
  //   this.total = null;
  //   this.prescription = event;
  //   this.listDetails = event.detalles;
  //   this.idForRequest = this.removeSquareBracket(_.map(this.listDetails, 'id'));
  //   this.getDispatchService(event.codiRece);
  // }

  // getDispatchService(id: any) {
  //   this.mongo.getDispatchById(id).subscribe((resultDispatch: any) => {
  //     console.log(resultDispatch, 'DESPACHOS');
  //     this.dispatchs = resultDispatch;
  //     this.addDetails = this.addDispatchPrescription();
  //     this.getInfoProductByListId(this.idForRequest);
  //   });
  // }

  // getInfoProductByListId(ids: any) {
  //   this.mongo.getInfoProducts(ids).subscribe((resultGetInfoProducts: any) => {
  //     console.log(resultGetInfoProducts, 'PORDUCOTS');
  //     this.listProducts = resultGetInfoProducts;
  //     this.processDataInfoProducts();
  //   });
  // }

  // processDataInfoProducts() {
  //   this.dataForView = [];
  //   const quantityOfProducts = _.map(this.listDetails, 'cantidad');
  //   const priceProduct = _.map(this.listProducts, 'precioDistribucion');
  //   console.log(this.listProducts);

  //   this.data = { index: null, product: '', totalPrescription: '', remaining: null, totalDispatch: 0, price: null, subtotal: null };
  //   let i = 0;
  //   for (const elemnt of this.listProducts) {
  //     this.data.index = i;
  //     this.data._id = elemnt._id;
  //     this.data.product = this.listProducts[i].codigoProducto.nombre;
  //     this.data.presentation = this.listProducts[i].codigoProducto.presentacion;
  //     this.data.concentration = this.listProducts[i].codigoProducto.concentracion;
  //     this.data.pharmacyForm = this.listProducts[i].codigoProducto.formaFarmaceutica;
  //     this.data.totalPrescription = quantityOfProducts[i];
  //     let quant = this.extractDataById(this.addDetails, elemnt._id);
  //     if (quant.length === 0) {
  //       this.data.remaining = quantityOfProducts[i];
  //     } else {
  //       this.data.remaining = (quantityOfProducts[i] - quant[0].cantidad);
  //     }
  //     this.data.price = priceProduct[i];
  //     this.dataForView.push(this.data);
  //     this.data = { index: null, product: '', totalPrescription: '', remaining: null, totalDispatch: 0, price: null, subtotal: null };
  //     i++;
  //   }
  //   console.log(this.dataForView);
  //   this.controlPrescription = this.verifyRemaining();
  //   if (this.controlPrescription === true) {
  //     this.updatePrescription({id: this.prescription._id, estadoReceta: 'finalizada'});
  //   } else {
  //     this.spinner.hide();
  //     this.toastSuccess('', 'Se ha generado correctamente tu compra');
  //     this.router.navigate(['receta']);
  //   }
  //   console.log(this.controlPrescription, 'BANDERA');
    
  // }

  // verifyRemaining() {
  //   let band = true;
  //   this.dataForView.map((object: any) => {
  //     if (object.remaining > 0) {
  //       band = false;
  //     }
  //   });

  //   return band;
  // }

  // updatePrescription(dataPrescription: any) {
  //   this.mongo.updatePrescriptionService(dataPrescription).subscribe((resultUpdate: any) => {
  //     console.log('RECETA ACTUALIZADA');
  //     this.deleteCartPatient(this.userData.identificacion);
      
  //   });
  // }

  // deleteCartPatient (dni: any) {
  //   this.mongo.deleteCartPatientService(dni).subscribe((result: any) => {
  //     this.toastSuccess('', 'Se ha generado correctamente tu compra');
  //     this.spinner.hide();
  //     this.router.navigate(['receta']);
  //   });
  // }

  // extractDataById(data, id) {
  //   return _.filter(data, function (ob) { return ob.id === id; });
  // }
  // removeSquareBracket(array: []) {
  //   let resultRemove = '';
  //   array.map(function (elememnt: any) {
  //     resultRemove += `${elememnt},`;
  //   });
  //   return (resultRemove.slice(0, (resultRemove.length - 1)));
  // }

}



