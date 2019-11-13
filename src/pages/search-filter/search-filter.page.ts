import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

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

  constructor(
    private modalCtrl: ModalController,
    private auth: AuthService,
    private loadingCtrl: LoadingService,
    private route: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit() {
  
    this.getMedicalCenter();
    this.getSpecialities();
  }

  closeModal() {
    this.modalCtrl.dismiss({
      // 'data': dataCita
    });
  }

  // getMedics() {
  //   this.loadingCtrl.presentLoading();
  //   let url = 'medico/getData?model=userMedico&fields=';
  //   this.auth.getDataByUrlCustom(url).subscribe((result: any) => {
  //     console.log(result, 'medicos lista');
  //     this.medic = result;
  //     this.loadingCtrl.dismiss();
  //   }, (err) => {
  //     console.log(err, 'errores');
  //   });
  // }

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

  // getMedicByCity() {
  //   this.loadingCtrl.presentLoading();
  //   let url = 'medico/getData?model=userMedico&params=ciudad=loja';
  //   this.auth.getDataByUrlCustom(url).subscribe((result: any) => {
  //     console.log(result, 'ciudades medicos');
  //     this.medicsByCity = result;
  //     this.loadingCtrl.dismiss();
  //   }, (err) => {
  //     console.log(err, 'errores');
  //   });
  // }

  codeSelected() {
    console.log( this.medicalC, 'dta del select');
    
  }
}
