import { Message } from "./../../shared/model/message";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ɵEMPTY_MAP
} from "@angular/core";
import * as $ from "jquery";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { IonSlides, ToastController, AlertController } from "@ionic/angular";
// import * as $ from '@types/jquery';
// import * as postscribe from 'postscribe';
import { UbicacionService } from "../../app/services/ubicacion.service";
// declare var Paymentez: any;
// declare var PaymentezCheckout: any;
import * as mapboxgl from "mapbox-gl";
import { environment } from "src/environments/environment";
import { Geolocation, Geoposition } from "@ionic-native/geolocation/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { LocationAccuracy } from "@ionic-native/location-accuracy/ngx";
import {
  faCreditCard,
  faMoneyCheckAlt,
  faMoneyBill
} from "@fortawesome/free-solid-svg-icons";
import { ToastService } from "../../app/services/toast.service";
import { DataService } from "src/app/services/data.service";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { Options } from "../../shared/mock/option-pay";
import { formatDate } from "@angular/common";
import * as _ from "lodash";
import { LoadingService } from "src/app/services/loading.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Platform } from "@ionic/angular";
declare var ol: any;

@Component({
  selector: "app-payment",
  templateUrl: "./payment.page.html",
  styleUrls: ["./payment.page.scss"]
})
export class PaymentPage implements OnInit {
  faCreditCard = faCreditCard;
  faMoneyCheckAlt = faMoneyCheckAlt;
  faMoneyBill = faMoneyBill;
  metodoPago: any;
  selectMetodo = false;

  isDatosPersonales = false;
  isDireccion: boolean;
  isPago = false;
  marker: any;
  cboxPoliticas = false;
  currentTab: string = "step1";
  className: string = "one-class";
  options: any;
  cards: any;
  active: any;
  activeCard: any;
  isCard = false;
  isContraEntrega = false;
  dataForView: any;
  prescription: any;
  total: any;
  iva = 0.12;
  data: any;
  listDetails: any;
  idForRequest: any;
  dispatchs: any;
  addDetails: any;
  listProducts: any;
  controlPrescription: any;
  userData: any;

  horario = [{ name: "mañana" }, { name: "tarde" }];

  horarioSelected: any;
  sel = false;

  myForm: FormGroup;
  formData = new FormData();
  public datosPersonalesFrom: FormGroup;
  public direccionForm: FormGroup;
  public submitAttempt: boolean = false;

  @ViewChild("map", { static: false }) mapElement: ElementRef;

  mapbox = mapboxgl as typeof mapboxgl;
  map: mapboxgl.Map;
  style = "mapbox://styles/mapbox/streets-v11";
  // Coordenadas de la localización donde queremos centrar el mapa
  lat: number = -3.974222033;
  lng: number = -79.20786264;
  zoom = 13;
  user: any;
  timetest: any;
  accuracy: any;
  timestamp: any;

  sliderConfig = {
    slidesPerView: 2,
    spaceBetween: 1,
    centeredSlides: true
  };
  intervalIni: any;

  constructor(
    public fb: FormBuilder,
    public geolocation: Geolocation,
    public toast: ToastService,
    private dataService: DataService,
    private router: Router,
    public toastController: ToastController,
    private auth: AuthService,
    private loadingCtrl: LoadingService,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    public platform: Platform,
    public alertController: AlertController
  ) {
    //this.isDatosPersonales = true;
    this.options = Options.options;
    this.cards = Options.cards;
    this.isDireccion = true;
    this.user = JSON.parse(localStorage.getItem("userPaciente"));

    this.dataForView = this.dataService.dataForPay;
    this.prescription = this.dataService.dataReceta;
    console.log(this.dataForView, "DATA PARA DESPACHAR");
    console.log(this.prescription, "RECETA PARA DESPACHAR");
    this.timetest = Date.now();

    //this.checkGPSPermission();
  }

  ngOnInit() {
    this.checkGPSPermission();

    this.total = this.dataForView.reduce(
      (acc, obj) => acc + obj.totalDispatch * obj.price,
      0
    );
    this.total = parseFloat(this.total).toFixed(2);
    this.calculateTotalDispatch();
    this.initForms();
  }

  changeTab(tab: string) {
    this.currentTab = tab;
    if (tab === "step1") {
    }
    if (tab === "step2") {
    }
  }

  // ionViewDidLoad() {
  //   this.getCurrentPosition();
  // }

  // ionViewDidEnter() {
  //   this.getCurrentPosition();
  // }

  checkGPSPermission() {
    this.androidPermissions
      .checkPermission(
        this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
      )
      .then(
        result => {
          if (result.hasPermission) {
            //If having permission show 'Turn On GPS' dialogue
            this.askToTurnOnGPS();
          } else {
            //If not having permission ask for permission
            this.requestGPSPermission();
          }
        },
        err => {
          alert(err);
        }
      );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions
          .requestPermission(
            this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
          )
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },

            error => {
              //Show alert if user click on 'No Thanks'
              alert(
                "requestPermission Error requesting location permissions " +
                  error
              );
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy
      .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
      .then(
        () => {
          // When GPS Turned ON call method to get Accurate location coordinates
          this.getCurrentPosition();
        },
        err => {
          console.log("error " + JSON.stringify(err));
          this.presentAlertConfirm();
        }
        //error => alert('Debes activar GPS para continuar' + JSON.stringify(error))
      );
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: "Para continuar debes activar tu ubicación",
      backdropDismiss: false,
      buttons: [
        {
          text: "Entendido",
          handler: () => {
            this.askToTurnOnGPS();
          }
        }
      ]
    });
    await alert.present();
  }

  getCurrentPosition() {
    this.geolocation
      .getCurrentPosition({
        enableHighAccuracy: true
      })
      .then(coordinates => {
        console.log("POSICION MAPA", coordinates);
        this.lat = coordinates.coords.latitude;
        this.lng = coordinates.coords.longitude;
        // this.accuracy = coordinates.coords.accuracy;
        // this.timestamp = coordinates.timestamp;
        this.intervalIni = setInterval(() => {
          this.loadMap();
          clearInterval(this.intervalIni);
        }, 2000);
      })
      .catch(error => {
        console.log("Error getting location", error);
      });
  }

  addMarker() {
    let el = document.createElement("div");
    el.className = "marker";
    el.style.backgroundImage = "url('assets/markers/location.png')";
    el.style.backgroundSize = "cover";
    el.style.width = "40px";
    el.style.height = "40px";

    let centerMap = this.map.getCenter();
    this.marker = new mapboxgl.Marker(el, {
      draggable: false
    })
      .setLngLat([this.lng, this.lat])
      .addTo(this.map);
  }

  loadMap() {
    this.mapbox.accessToken = environment.mapbox.accessToken;
    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [this.lng, this.lat],
      zoom: 15
    });
    this.addMarker();
    this.map.on("move", () => {
      console.log(`Current Map Center: ${this.map.getCenter()}`);
      const centerMap = this.map.getCenter();
      this.lng = centerMap.lng;
      this.lat = centerMap.lat;
      this.marker.setLngLat([centerMap.lng, centerMap.lat]).addTo(this.map);
    });

    // var features = [];
    // var vectorLayer;
    // var vectorSource;
    // var iconFeature, iconFeatureDomicilio;

    // var iconStyle = new ol.style.Style({
    //   image: new ol.style.Icon(
    //     /** @type {olx.style.IconOptions} */ {
    //       anchor: [0.5, 50],
    //       anchorXUnits: "fraction",
    //       anchorYUnits: "pixels",
    //       opacity: 0.9,
    //       //size : [60,60],
    //       scale: 0.1,
    //       src: "assets/icon/redMarker.png"
    //     }
    //   )
    // });

    // // var iconDomicilio = new ol.style.Style({
    // //   image: new ol.style.Icon(
    // //     /** @type {olx.style.IconOptions} */ {
    // //       anchor: [0.5, 50],
    // //       anchorXUnits: "fraction",
    // //       anchorYUnits: "pixels",
    // //       opacity: 0.9,
    // //       //size : [60,60],
    // //       scale: 0.1,
    // //       src: "assets/markers/location.png"
    // //     }
    // //   )
    // // });

    // this.map = new ol.Map({
    //   target: "map",
    //   layers: [
    //     new ol.layer.Tile({
    //       //source: new ol.source.OSM()
    //       source: new ol.source.XYZ({
    //         url: "assets/loja/{z}/{x}/{y}.png"
    //       })
    //     }) //,
    //     //vectorLayer
    //   ],

    //   view: new ol.View({
    //     center: ol.proj.transform(
    //       [this.lng, this.lat],
    //       "EPSG:4326",
    //       "EPSG:900913"
    //     ),
    //     zoom: 15,
    //     maxZoom: 17,
    //     minZoom: 14
    //   })
    // });

    // iconFeature = new ol.Feature({
    //   geometry: new ol.geom.Point(
    //     ol.proj.transform(
    //       [Number(this.lng), Number(this.lat)],
    //       "EPSG:4326",
    //       "EPSG:3857"
    //     )
    //   )
    // });
    // iconFeature.setStyle(iconStyle);
    // features.push(iconFeature);
    // vectorSource = new ol.source.Vector({
    //   features: features //add an array of features
    //   //, style: iconStyle     //to set the style for all your features...
    // });
    // vectorLayer = new ol.layer.Vector({
    //   source: vectorSource
    // });
    // this.map.addLayer(vectorLayer);

    // iconFeature = new ol.Feature({
    //   geometry: new ol.geom.Point(
    //     ol.proj.transform(
    //       [Number(this.lng), Number(this.lat)],
    //       "EPSG:4326",
    //       "EPSG:3857"
    //     )
    //   )
    // });
    // // iconFeatureDomicilio = new ol.Feature({
    // //   geometry: new ol.geom.Point(
    // //     ol.proj.transform(
    // //       [Number(this.lng + 0.001), Number(this.lat)],
    // //       "EPSG:4326",
    // //       "EPSG:3857"
    // //     )
    // //   )
    // // });

    // iconFeature.setStyle(iconStyle);
    // //iconFeatureDomicilio.setStyle(iconDomicilio);
    // features.push(iconFeature);
    // //features.push(iconFeatureDomicilio);
    // vectorSource = new ol.source.Vector({
    //   features: features
    // });
    // vectorLayer = new ol.layer.Vector({
    //   source: vectorSource
    // });
    // this.map.addLayer(vectorLayer);
  }

  initForms() {
    this.direccionForm = this.fb.group({
      callePrincipal: [this.user.callePrincipal, Validators.required],
      calleSecundaria: [this.user.calleSecundaria, Validators.required],
      ciudad: [this.user.ciudad, Validators.required],
      numCasa: [this.user.numCasa, Validators.required],
      referencia: [this.user.referencia, Validators.required],
      longitud: [""],
      latitud: [""]
      //horarioEntrega: ['', Validators.required],
    });

    this.datosPersonalesFrom = this.fb.group({
      nombres: [
        this.user.priNombre,
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern("[a-zA-Z ]*"),
          Validators.required
        ])
      ],
      apellidos: [
        this.user.priApellido,
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern("[a-zA-Z ]*"),
          Validators.required
        ])
      ],
      telefono: [
        this.user.telefonoCelular,
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern("[0-9]*"),
          Validators.required
        ])
      ],
      email: [this.user.user.username, [Validators.email, Validators.required]],
      identificacion: [
        this.user.identificacion,
        Validators.compose([
          Validators.required,
          Validators.pattern("^(?:[0-9]{10},)*[0-9]{10}$")
        ])
      ]
    });
  }

  goDireccion() {
    this.isDatosPersonales = false;
    this.isDireccion = true;
    this.changeTab("step1");
  }

  gotoPagos() {
    this.isDatosPersonales = true;
    this.isDireccion = false;
    this.isPago = false;
  }

  goData() {
    this.isDatosPersonales = true;
    this.isDireccion = false;
    this.isPago = false;
    this.changeTab("step2");
  }

  goFac() {
    this.isDatosPersonales = true;
    this.isDireccion = false;
    this.isPago = false;
    this.changeTab("step2");
  }

  goPayInformation() {
    this.isDatosPersonales = false;
    this.isDireccion = false;
    this.isPago = true;
  }

  next() {}

  goDatos() {
    this.isDatosPersonales = false;
    this.isDireccion = false;
    this.isPago = true;
    this.changeTab("step3");
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: "Transacción exitosa",
      duration: 2000,
      color: "dark"
    });
    toast.present();
  }

  save() {
    this.submitAttempt = true;
    if (!this.datosPersonalesFrom.valid) {
      // this.slider.slideTo(0);
    } else if (!this.direccionForm.valid) {
      // this.slider.slideTo(1);
    } else {
      console.log("success!");
      console.log(this.datosPersonalesFrom.value);
      console.log(this.direccionForm.value);
    }
  }

  selectmetodo() {
    this.selectMetodo = true;
    console.log(this.selectMetodo);
  }

  updateActive(category) {
    console.log(category.tipo, "categoria selccionada");
    this.active = category;
    if (category.tipo === "tarjeta") {
      this.isCard = true;
      this.isContraEntrega = false;
    } else {
      this.isCard = false;
      this.isContraEntrega = true;
    }
  }

  updateShedule(horario) {
    console.log(horario.name, "horario seleccionado");
    this.horarioSelected = horario;
    this.sel = true;
    //this.getCurrentPosition();
  }

  updateActiveCard(card) {
    this.activeCard = card;
  }

  goPay() {
    this.dataForView = this.dataService.dataForPay;
    this.prescription = this.dataService.dataCompra;
    console.log(this.dataForView, "data forview");
    this.dataForView.push(this.prescription);
    console.log(this.dataForView, "data para guardar");
    this.createCartP({
      identiPac: this.user.identificacion,
      compra: this.dataForView
    });
  }

  createCartP(data) {
    this.auth.createCart(data).subscribe(() => {
      this.presentToast();
      this.router.navigate(["home"]);
    });
  }

  save1(pago) {
    console.log(pago, "tipopago");
  }

  saveDispatch() {
    const details = [];
    let estadoPagoV = "";
    let formaPagoV = "";
    this.direccionForm.controls["longitud"].setValue(this.lng);
    this.direccionForm.controls["latitud"].setValue(this.lat);
    if (this.active.tipo === "contraPedido") {
      estadoPagoV = "impago";
      formaPagoV = "contraPedido";
    }
    this.dataForView.map(function(element) {
      let dataPush = {
        id: element._id,
        cantidad: parseInt(element.totalDispatch, 10)
      };
      details.push(dataPush);
    });
    const dataForDispatch = {
      idReceta: this.prescription.codiRece,
      datosReceta: this.prescription._id,
      datosPaciente: this.prescription.datosPac,
      estadoDespacho: 'nuevo',
      detalles: JSON.stringify(details),
      fecha: formatDate(new Date(), "yyyy-MM-dd", "en-US"),
      totalDespacho: this.calculateTotalDispatch(),
      //horarioEntrega: this.horarioSelected.name,
      horarioEntrega: "mañana",
      datosFactura: this.datosPersonalesFrom.value,
      datosEntrega: this.direccionForm.value,
      estadoPago: estadoPagoV,
      formaPago: formaPagoV,
      identiPac: this.user.identificacion,
      celular: this.user.telefonoCelular
    };
    this.createDispatchService(dataForDispatch);
  }

  calculateTotalDispatch() {
    const sub = this.total * this.iva;
    const result = parseFloat(this.total) + sub;
    return result.toFixed(2);
  }

  //SE CREA DESPACHO
  createDispatchService(data: any) {
    console.log(this.lng, this.lat, "long y lat");
    this.loadingCtrl.presentLoading();
    this.auth.createDispatch(data).subscribe((resultCreate: any) => {
      console.log("DESPACHO GUARDADO");
      this.auth.senDataDispatch(data);
      this.exportData(this.prescription);
      // this.deleteCartPatient(this.userData.identificacion);
    });
    this.loadingCtrl.dismiss();
  }

  exportData(event) {
    console.log(event, "RECETA");

    this.data = {
      index: null,
      product: "",
      totalPrescription: "",
      remaining: null,
      totalDispatch: 0,
      price: null,
      subtotal: null
    };
    this.dataForView = [];
    this.total = null;
    this.prescription = event;
    this.listDetails = event.detalles;
    this.idForRequest = this.removeSquareBracket(_.map(this.listDetails, "id"));
    this.getDispatchService(event.codiRece);
  }

  removeSquareBracket(array: []) {
    let resultRemove = "";
    array.map(function(elememnt: any) {
      resultRemove += `${elememnt},`;
    });
    return resultRemove.slice(0, resultRemove.length - 1);
  }

  getDispatchService(id: any) {
    this.auth.getDispatchById(id).subscribe((resultDispatch: any) => {
      console.log(resultDispatch, "DESPACHOS");
      this.dispatchs = resultDispatch;
      this.addDetails = this.addDispatchPrescription();
      this.getInfoProductByListId(this.idForRequest);
    });
  }

  addDispatchPrescription() {
    let resultAdd = null;
    let allDetails = [];
    this.dispatchs.map((elementMap: any) => {
      console.log(this.auth.convertStringToArrayOfObjects(elementMap.detalles));
      allDetails = this.concatDetailsDispatch(
        this.auth.convertStringToArrayOfObjects(elementMap.detalles),
        allDetails
      );
    });
    resultAdd = this.addListById(allDetails);
    return resultAdd;
  }

  concatDetailsDispatch(list1: any, list2: any) {
    return _.concat(list2, list1);
  }

  addListById(data: any) {
    const summary = _.chain(data)
      .reduce(function(acc, i) {
        if (i.cantidad > 0) {
          acc[i.id] = (acc[i.id] || 0) + i.cantidad;
        }
        return acc;
      }, {})
      .toPairs()
      .map(function(x) {
        var tmp: any = {};
        tmp.id = x[0];
        tmp.cantidad = x[1];
        return tmp;
      })
      .value();
    return summary;
  }

  extractDataById(data, id) {
    return _.filter(data, function(ob) {
      return ob.id === id;
    });
  }

  getInfoProductByListId(ids: any) {
    this.auth.getInfoProducts(ids).subscribe((resultGetInfoProducts: any) => {
      console.log(resultGetInfoProducts, "PORDUCOTS");
      this.listProducts = resultGetInfoProducts;
      this.processDataInfoProducts();
    });
  }

  processDataInfoProducts() {
    this.dataForView = [];
    const quantityOfProducts = _.map(this.listDetails, "cantidad");
    const priceProduct = _.map(this.listProducts, "precioDistribucion");
    console.log(this.listProducts);

    this.data = {
      index: null,
      product: "",
      totalPrescription: "",
      remaining: null,
      totalDispatch: 0,
      price: null,
      subtotal: null
    };
    let i = 0;
    for (const elemnt of this.listProducts) {
      this.data.index = i;
      this.data._id = elemnt._id;
      this.data.product = this.listProducts[i].idProducto.nombre;
      this.data.presentation = this.listProducts[i].idProducto.presentacion;
      this.data.concentration = this.listProducts[i].idProducto.concentracion;
      this.data.pharmacyForm = this.listProducts[
        i
      ].idProducto.formaFarmaceutica;
      this.data.totalPrescription = quantityOfProducts[i];
      let quant = this.extractDataById(this.addDetails, elemnt._id);
      if (quant.length === 0) {
        this.data.remaining = quantityOfProducts[i];
      } else {
        this.data.remaining = quantityOfProducts[i] - quant[0].cantidad;
      }
      this.data.price = priceProduct[i];
      this.dataForView.push(this.data);
      this.data = {
        index: null,
        product: "",
        totalPrescription: "",
        remaining: null,
        totalDispatch: 0,
        price: null,
        subtotal: null
      };
      i++;
    }
    console.log(this.dataForView);
    this.controlPrescription = this.verifyRemaining();
    if (this.controlPrescription === true) {
      this.updatePrescription({
        id: this.prescription._id,
        estadoReceta: "finalizada"
      });
    } else {
      this.presentToastCompra("COMPRA PARCIAL");
      this.router.navigate(["prescription-detail"]);
    }
    console.log(this.controlPrescription, "BANDERA");
  }

  verifyRemaining() {
    let band = true;
    this.dataForView.map((object: any) => {
      if (object.remaining > 0) {
        band = false;
      }
    });
    return band;
  }

  updatePrescription(dataPrescription: any) {
    this.loadingCtrl.presentLoading();
    this.auth
      .updatePrescriptionService(dataPrescription)
      .subscribe((resultUpdate: any) => {
        console.log(resultUpdate, "RECETA ACTUALIZADA");
        this.deleteCartPatient(this.user.identificacion);
      });
      
    this.loadingCtrl.dismiss();
  }

  // updateListPrescription(){
  //   this.auth.deleteCartPatientService(dni).subscribe((result: any) => {
  //     this.presentToastCompra('COMPRASTE TODA LA RECETA');
  //     this.router.navigate(['prescription-detail']);
  //   });
  // }

  deleteCartPatient(dni: any) {
    this.auth.deleteCartPatientService(dni).subscribe((result: any) => {
      this.presentToastCompra("COMPRASTE TODA LA RECETA");
      this.router.navigate(["prescription-detail"]);
    });
  }

  // extractDataById(data, id) {
  //   return _.filter(data, function (ob) { return ob.id === id; });
  // }

  async presentToastCompra(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: "dark"
    });
    toast.present();
  }
}
