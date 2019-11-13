import { DataService } from 'src/app/services/data.service';
import { Injectable } from '@angular/core';
import { AutoCompleteService } from 'ionic4-auto-complete';
import { LoadingService } from './loading.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class SimpleFunction implements AutoCompleteService {
  labelAttribute = '';

  public objects = [];

  constructor(
    private loadingCtrl: LoadingService,
    private auth: AuthService,
    private dataService: DataService
  ) { }

  getSpecialities() {
    this.loadingCtrl.presentLoading();
    let url = 'administracion/especialidad';
    this.auth.getDataByUrlCustom(url).subscribe((result: any) => {
      console.log(result, 'especialidades');
      this.objects = result;
      this.dataService.tagsParam = result;
      this.dataService.param();
      this.labelAttribute = 'nombre';
      this.loadingCtrl.dismiss();
 
    }, (err) => {
      console.log(err, 'errores');
    });
  }

  getMedicalCenter() {
    this.loadingCtrl.presentLoading();
    let url = 'administracion/centroMedico';
    this.auth.getDataByUrlCustom(url).subscribe((result: any) => {
      console.log(result, 'centros Medicos');
      this.objects = result;
      this.labelAttribute = 'nombre';
      this.dataService.tagsParam = result;
      this.loadingCtrl.dismiss();
    }, (err) => {
      console.log(err, 'errores');
    });
  }

  getCity() {
    this.loadingCtrl.presentLoading();
    let url = 'medico/listAllCities/';
    this.auth.getDataByUrlCustom(url).subscribe((result: any) => {
      console.log(result, 'Ciudades');
      this.objects = result;
      this.labelAttribute = 'ciudad';
      this.dataService.tagsParam = result;
      this.loadingCtrl.dismiss();
    }, (err) => {
      console.log(err, 'errores');
    });
  }

  getResults(keyword) {
    keyword = keyword.toLowerCase();
    return this.objects.filter(
      (object) => {
        const value = object[this.labelAttribute].toLowerCase();
        return value.includes(keyword);
      }
    );
  }
}