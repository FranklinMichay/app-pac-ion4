import { map } from 'rxjs/operators';
import { SearchFilterPage } from './../search-filter/search-filter.page';
import { LoadingService } from '../../app/services/loading.service';
import { ProfileMedicPage } from './../profile-medic/profile-medic.page';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../src/app/services/auth.service'
import * as _ from 'lodash';  // tslint:disable-line
//import 'rxjs/add/operator/debounceTime';
import { NavController, NavParams, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms'
import { SimpleFunction } from '../../app/services/simple-function.service';
import { AutoCompleteOptions } from 'ionic4-auto-complete';
import { logWarnings } from 'protractor/built/driverProviders';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

export interface AutoCompleteModel {
  nombre: any;
  id: any;
  ciudad: any;
  detalle: any;
  direccion: any;
  estado: any;
  pais: any;
  provincia: any;
}

@Component({
  selector: 'app-search-medic',
  templateUrl: './search-medic.page.html',
  styleUrls: ['./search-medic.page.scss'],
})
export class SearchMedicPage implements OnInit {

  timeNumber: number = 0;
  medics: any;
  medicsOriginal: any = [];
  searching: boolean = true;
  speciality: any = '';
  city: any = '';
  medicFiltered: any;
  specialties: any;
  params: any = [
    {
      "name": "Ciudad",
    },
    {
      "name": "Centro Medico",
    },
    {
      "name": "Especialidad",
    }
  ];

  param = '';
  medicalCenter: any;
  searchTerm: string = '';
  searchControl: FormControl;
  item: any;
  loading: any;
  specilities: any;
  public options: AutoCompleteOptions;
  public selected = [];
  form: FormGroup;
  tags = [];
  paramsForRequest: any = {};
  imageMedic: any;
  fotoPerfil: any;
  dataPaciente: any
  medicByCity: any;

  url: any; 

  constructor(
    public navCtrl: NavController,
    private auth: AuthService,
    //public loadingCtrl: LoadingController,
    public mdlCtrl: ModalController,
    public toast: ToastController,
    private router: Router,
    private loadingCtrl: LoadingService,
    public provider: SimpleFunction,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private sanitizer: DomSanitizer,


  ) {

    this.url = environment.url

    this.options = new AutoCompleteOptions();
    this.options.autocomplete = 'on';
    this.options.cancelButtonIcon = 'assets/icons/clear.svg';
    this.options.clearIcon = 'assets/icons/clear.svg';
    this.options.debounce = 750;
    this.options.placeholder = 'Ingrese parámetro para la búsqueda';
    this.options.searchIcon = 'assets/icons/add-user.svg';
    this.options.type = 'search';
    this.dataPaciente = JSON.parse(localStorage.getItem('user'));
    this.medicsByCity();

  }

  ngOnInit() {
    //this.getDataList();
  }


  on(output, event): void {
    console.log(output);
    // if (this.selected){
    //   console.log(this.selected[0].id, 'SELCCIONADO');
    // }
    // console.log(event);
    //this.getMedicBySpeciality();
  }

  returnHome() {
    this.router.navigate(['home']);
  }

  getInfoSelect() {

    if (this.param === 'Especialidad') {
      let url = 'administracion/especialidad';
      this.auth.getDataByUrlCustom(url).subscribe((result: any) => {
        this.tags = result;
        console.log(this.tags, 'tags');
      }, (err) => {
        console.log(err, 'errores');
      });
    } else if (this.param === 'Ciudad') {
      let url = 'medico/listAllCities/';
      this.auth.getDataByUrlCustom(url).subscribe((result: any) => {
        this.tags = result.map(item => {
          return { nombre: item.ciudad }
        });
        console.log(this.tags, 'tags');
      }, (err) => {
        console.log(err, 'errores');
      });

    } else if (this.param === 'Centro Medico') {
      let url = 'administracion/centroMedico';
      this.auth.getDataByUrlCustom(url).subscribe((result: any) => {
        this.tags = result;
        console.log(this.tags, 'tags');
      }, (err) => {
        console.log(err, 'errores');
      });
    }
  }

  onTextChange() {
    let elementSelected = this.selected[(this.selected.length - 1)];
    if (this.param === 'Ciudad') {
      this.paramsForRequest.ciudad = elementSelected.nombre
    } else if (this.param === 'Centro Medico') {
      this.paramsForRequest.centroMedico = elementSelected.id
    } else if (this.param === 'Especialidad') {
      this.paramsForRequest.especialidad_id = elementSelected.id
    }
    console.log(this.paramsForRequest);
  }

  onInput(keydata) {
    console.log(keydata.target.value, 'in ipnut');
    let query: any;
    if (keydata.target.value) {
      setTimeout(() => {
        query = keydata.target.value;
        this.searchProduct(query);
      }, 700);
    } else {
      this.medics = this.medicFiltered;
    }
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

  updateData() {
    console.log(this.speciality, 'data para consulta');

  }

  getMedicBySpeciality() {
    this.loadingCtrl.presentLoading();
    let url = '/medico/getData?model=userMedico&params=especialidad_id=' + this.selected[0].id;
    this.auth.getDataByUrlCustom(url).subscribe((result: any) => {
      console.log(result, 'medicos por id de especialidad');
      this.medics = result;
      this.loadingCtrl.dismiss();
    }, (err) => {
      console.log(err, 'errores');
    });
  }

  getMedicsForParams() {
    this.loadingCtrl.presentLoading();
    this.auth.sendParamsForSearch(this.paramsForRequest).subscribe((result: any) => {
      this.medics = result 
      this.medicFiltered = result;
      
      console.log(result, 'medicos encontrados');
      this.selected = [];
      this.paramsForRequest = {};
      this.loadingCtrl.dismiss();
    }, (err) => {
      console.log(err, 'error al traer medicos');
    });
  }

  getDataList() {
    this.loadingCtrl.presentLoading();
    this.auth.getMedics()
      .then((data) => {
        console.log(data, 'Los medicos');
        this.medics = data;
        this.loadingCtrl.dismiss();
      }, (err) => { 
        console.log(err, 'error al obtener datos');
      });
  }

  searchMedics(query: any) {
    let val = query.target.value.toLowerCase();
    if (val && val.trim() != '') {
      this.medicFiltered = this.medicFiltered.filter((item) => {
        /* const text = (item.fields.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1) + ' ' + 
        (item.fields.apellido.toLowerCase().indexOf(val.toLowerCase()) > -1); */
        return (item.fields.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1)
        //return (val.test(text))
      });
    } else {
      this.medicFiltered = this.medics;
    }
  }

  searchProduct(query: any) {
    console.log(query, 'query');
    const patt = new RegExp(query.toLowerCase());
    if (query && query.length > 3) {
      console.log(this.medicFiltered, 'un metod sharch22');
      const res = _.filter(this.medicFiltered, o => {
        const statement =
          o.priNombre.toLowerCase() + ' ' +
          o.priApellido.toLowerCase();
        o.segNombre.toLowerCase() + ' ' +
          o.segApellido.toLowerCase();
        return (patt.test(statement));
      });
      this.medics = res;
    } else {
      this.medics = this.medicFiltered;
    }
  }

  buscar(event) {
    console.log(event);
  }

  async presentModal() {
    const modal = await this.mdlCtrl.create({
      component: SearchFilterPage,
      cssClass: 'css-modal',
    });
    modal.onDidDismiss()
      .then((data) => {
        console.log(data, 'data del dismis modal ok');
        this.router.navigate(['search-medic'], { state: data });
      });
    return await modal.present();
  }

  filterMedicalCenter(cMedico) {
    console.log('in medical center filter', this.medics);
    this.medics = _.filter(this.medics, (v) => {
      console.log(v, 'is v');
      const r = _.filter(v.fields.centroMedico, (c) => {
        console.log(c, 'is c');
        if (c.nombre === cMedico)
          return true;
      });
      console.log(r, 'is r');
      if (r.length > 0) return v
    });
  }

  filterData() {
    console.log(this.medics, 'this.origin', this.params);
    this.medics = _.filter(this.medicsOriginal, _.matches(this.params));
    console.log(this.medics, 'this.origin after', this.params);
    if (this.medics.length != 0)
      return true;
    return false
  }

  goItem(id: string) {
    // this.navCtrl.push(ProductDetailsPage, {id: id});
  }

  goToDetails(medic) {
    console.log(medic, 'DATOS DEL MEDICO SELECCIONADO');
    this.dataService.dataMedic = medic;
    this.router.navigate(['profile-medic']);
  }

  medicsByCity() {
    this.loadingCtrl.presentLoading();
    let city = this.dataPaciente.ciudad.toUpperCase();
    this.auth.medicsByCity(city).subscribe((result: any) => {
      this.medics = result;
      this.medicFiltered = result;
      console.log(result, 'medicos por ciudad');
      this.loadingCtrl.dismiss();
    }, (err) => {
      console.log(err, 'error al traer medicos por ciudad');
    });
  }

}
