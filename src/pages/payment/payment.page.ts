import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as $ from 'jquery';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IonSlides } from '@ionic/angular';
// import * as $ from '@types/jquery';
// import * as postscribe from 'postscribe';
import { UbicacionService } from '../../app/services/ubicacion.service';
declare var Paymentez: any;
declare var PaymentezCheckout: any;
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { faCreditCard, faMoneyCheckAlt, faMoneyBill} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  faCreditCard = faCreditCard;
  faMoneyCheckAlt = faMoneyCheckAlt;
  faMoneyBill = faMoneyBill;
  metodoPago:any

  isDatosPersonales: boolean;
  isDireccion = false;
  isPago = false;
  marker: any;


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

  constructor(public fb: FormBuilder, public geolocation: Geolocation) {
    this.isDatosPersonales = true;
    this.user = JSON.parse(localStorage.getItem('user'));

  }

  ngOnInit() {
    this.initForms();

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

    this.datosPersonalesFrom = this.fb.group({
      nombres: [this.user.priNombre, Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      apellidos: [this.user.priApellido, Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      telefono: [this.user.telefonoCelular, Validators.compose([Validators.maxLength(30), Validators.pattern('[0-9]*'), Validators.required])],
      email: [this.user.user.username, [Validators.email, Validators.required]],
      identificacion: [this.user.identificacion, Validators.compose([Validators.required, Validators.pattern('^(?:[0-9]{10},)*[0-9]{10}$')])],
    });

    this.direccionForm = this.fb.group({

      callePrincipal: ['', Validators.required],
      calleSecundaria: ['', Validators.required],
      ciudad: [this.user.ciudad, Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      numCasa: ['', Validators.required],
      referencia: ['', Validators.required],

    });

  }

  goDireccion() {
    this.isDatosPersonales = false;
    this.isDireccion = true;
  }

  gotoPagos() {

    this.isDireccion = false;
    this.isPago = true;

  }

  next() {

  }

  goDatos() {
    this.isDatosPersonales = true;
    this.isDireccion = false;
    this.isPago = false;

  }

  goPay(){
    console.log('pagar');
    
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

  hideShowPassword() {

  }

  changeListener($event): void {

  }

  upload() {

  }

  onSubmit() {
    const {
      priNombre,
      segNombre,
      priApellido,
      segApellido,
      email,
      password,
      identificacion
    } = this.datosPersonalesFrom.value;

    const dataInf = {
      first_name: priNombre,
      last_name: priApellido,
      email: email,
      username: email,
      password,
      identificacion: identificacion,
    }

  }

}



