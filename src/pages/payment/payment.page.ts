import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as $ from 'jquery';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IonSlides } from '@ionic/angular';
// import * as $ from '@types/jquery';
// import * as postscribe from 'postscribe';
import { UbicacionService } from '../../app/services/ubicacion.service';
declare var Paymentez: any;
declare var PaymentezCheckout:any;
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  isDatosPersonales: boolean;
  isDireccion = false;
  isPago = false;

  myForm: FormGroup;
  formData = new FormData();
  public datosPersonalesFrom: FormGroup;
  public direccionForm: FormGroup;
  public submitAttempt: boolean = false;
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  @ViewChild('slider', { static: true }) slider: IonSlides;
 
  // @ViewChild("map") public mapElement: ElementRef;

  mapbox = (mapboxgl as typeof mapboxgl);
  map: mapboxgl.Map;
  style = `mapbox://styles/mapbox/streets-v11`;
  // Coordenadas de la localización donde queremos centrar el mapa
  lat = -4.011562;
  lng = -79.203182;
  zoom = 15;

  constructor( public fb: FormBuilder) { 
    this.isDatosPersonales = true;
    
  }

  ngOnInit() {
 this.initForms();

 

}

ngAfterViewInit() {
  this.loadMap();
}


ngAfterContentInit() {
  // this.loadMap();
}

loadMap(){
  console.log('ngAfterContentInit');
  
  this.mapbox.accessToken = environment.mapbox.accessToken;
  this.map = new mapboxgl.Map({
    container: this.mapElement.nativeElement,
    style: 'mapbox://styles/mapbox/bright-v9',
    zoom: this.zoom,
    center: [this.lng, this.lat],
    attributionControl: false
  });

}

initForms(){

  this.datosPersonalesFrom = this.fb.group({
    nombres: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
    apellidos: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
    telefono: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[0-9]*'), Validators.required])],
    email: ['', [Validators.email, Validators.required]],
    identificacion: ['', Validators.compose([Validators.required, Validators.pattern('^(?:[0-9]{10},)*[0-9]{10}$')])],
  });


  
  this.direccionForm = this.fb.group({

    callePrincipal: ['', Validators.required],
    calleSecundaria: ['', Validators.required],
    ciudad: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
    numCasa: ['', Validators.required],
    referencia: ['', Validators.required],

  });

}

goDireccion(){
  this.isDatosPersonales = false;
  this.isDireccion = true;
}

gotoPagos(){

  this.isDireccion = false;
  this.isPago = true;

}

next() {

}

prev() {
 
}

save() {

  this.submitAttempt = true;
  if (!this.datosPersonalesFrom.valid) {
    this.slider.slideTo(0);
  }
  else if (!this.direccionForm.valid) {
    this.slider.slideTo(1);
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



