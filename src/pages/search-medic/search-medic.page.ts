import { LoadingService } from '../../app/services/loading.service';
import { ProfileMedicPage } from './../profile-medic/profile-medic.page';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../src/app/services/auth.service'
import * as _ from 'lodash';  // tslint:disable-line
import { FormControl } from '@angular/forms'
//import 'rxjs/add/operator/debounceTime';
import { NavController, NavParams, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

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
  items: any;
  params: any = {
    fields: {
      ciudad: '',
      especialidad: ''
    }
  };
  medicalCenter: any;

  searchTerm: string = '';
  searchControl: FormControl;
  item: any;
  loading: any;

  constructor(
    public navCtrl: NavController,
    private auth: AuthService,
    //public loadingCtrl: LoadingController,
    public mdlCtrl: ModalController,
    public toast: ToastController,
    private router: Router,
    private loadingCtrl: LoadingService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.getDataList();
    //   this.getSpecialities();
    // const fromSpeciality = this.navParams.get('specialty');
    // if (fromSpeciality) {
    //   this.medicsOriginal = fromSpeciality;
    //   this.medics = fromSpeciality;
    //   console.log(fromSpeciality, 'from especialidades');
    // } else {
    //   this.getDataList();
    //   this.getSpecialities();
    // }
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
          o.fields.nombre.toLowerCase() + ' ' +
          o.fields.apellido.toLowerCase();
        //o.fields.especialidad.toLowerCase() + ' ' +
        //o.fields.ciudad.toLowerCase();
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
  // filterModal() {
  //   console.log(this.medics, 'medicos sin filtrar');
  //   let modal = this.mdlCtrl.create(ChatPage);
  //   //this.navCtrl.create(GetMeetingPage, {hour: _info});
  //   modal.present();
  //   modal.onDidDismiss((v) => {
  //     console.log(v, 'valores para filtrar');
  //     if (v) {
  //       this.params.fields = v.params;
  //       this.filterData();
  //       if (v.medicalCenter && this.filterData) {
  //         this.filterMedicalCenter(v.medicalCenter);
  //         this.medicalCenter = v.medicalCenter
  //       }
  //       else {
  //         this.medicalCenter = ''
  //       }
  //     }
  //   }
  //   );
  // }

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

  goBack() {
    this.navCtrl.pop();
  }

  goItem(id: string) {
    // this.navCtrl.push(ProductDetailsPage, {id: id});
  }

  goToDetails(medic) {
    console.log(medic, 'DATOS DEL MEDICO SELECCIONADO');
    this.dataService.dataMedic = medic;
    this.router.navigate(['profile-medic']);
  }

}
