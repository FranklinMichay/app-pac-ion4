import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Calendar } from '../../shared/model/calendar';
import * as socketIo from 'socket.io-client';
import * as _ from 'lodash';
import { ToastService } from '../../../src/app/services/toast.service'

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  config;
  socket;
  dataUser: any;
  user: any;
  httpOptions: any = {};
  idPaciente: any;
  private url = environment.apiURL1;
  private urlSocket = environment.socketUrl;
  private urlGetInfo = 'agenda/getData?model=agenda&params=';
  private urlMongoDB = environment.apiMongoDB;

  fechaMeeting: any;
  corsConfig: any = {};

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private toast: ToastService
  ) {
    this.initSocketIo();
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user) {
      this.idPaciente = this.user.id;
    }

    console.log(this.idPaciente, 'id paciente en rest');

  }

  initSocketIo() {
    const user = JSON.parse(localStorage.getItem('user')) ?
      JSON.parse(localStorage.getItem('user')) : {};

    this.socket = socketIo(this.urlSocket);
    console.log(this.urlSocket, 'url enviada');
    this.socket.emit('init', { receiver: { _id: user.id } });
  }

  sendNotify(data: any) {
    console.log(data, 'notificcion enviada');
    this.socket.emit('calendar', data);
  }

  // sendResponse(data: Response) {
  //   console.log(data, 'in send response client');
  //   this.socket.emit('response', data);
  // }

  getToken(data: any) {
    console.log(data, 'DATOS DE LOGIN');
    return new Promise((resolve, reject) => {
      this.httpClient.post(this.url + 'medico/api-token-auth/', data)
        .subscribe(res => {
          console.log(res, ' este es el token');
          this.httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': 'Token ' + res['token']
            })
          }
          console.log('httpOptions', this.httpOptions)
          resolve(res);
        }, (err) => {
          reject(err);
          //this.toast.getError(err);
          console.log(err, 'Error al generar Token');
        });
    });
  }

  loginMedico(data: any) {
    return this.httpClient.post(this.url + 'medico/api-token-auth/', data).pipe(
      map(
        (token: any) => {
          console.log('tokenpipe', token)
          this.httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': 'Token ' + token.token
            })
          }
          console.log('httpOptions', this.httpOptions)
        }
      )
    )
  }

  uploadImage(formData: FormData) {
    return this.httpClient.post<any>(this.url + 'paciente/fotoPrueba/', formData);
  }

  createUserPaciente(data: any): Observable<any> {
    console.log('dataUser', data)
    return this.httpClient.post<any>(this.url + 'paciente/createUserPaciente/', data);
  }

  getIdUser(correo) {
    return this.httpClient.get<any>(this.url + 'paciente/getIdUser/' + correo + '/')
  }

  registerPaciente(data): Observable<any> {
    this.corsConfig = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data',
      })
    }
    console.log('data-APirest', data)
    return this.httpClient.post<any>(this.url + 'paciente/createPerfilPaciente/', data);
  }

  getInfoPac(data: any): Observable<any> {
    console.log(data, ' data');
    //console.log(data.jsonPk, ' data');
    if (data.jsonPk != undefined) {
      return this.httpClient.get<any>(this.url + 'paciente/getData?model=userPaciente&params=user_id=' + data.jsonPk);
    }
    else {
      return this.httpClient.get<any>(this.url + 'paciente/getData?model=userPaciente&params=user_id=' + data);
    }
  }

  updateProfilePatient(data, id) {

    return this.httpClient.put<any>(this.url + 'paciente/updatePerfilPaciente/' + id + '/', data);
  }

  getByUrlCustom(url): Observable<any> {
    this.fechaMeeting = url;
    return this.httpClient.get<any>(this.url + 'agenda/getData?model=Agenda&params=' + url);
  }

  getDataByUrlCustom(url): Observable<any> {
    return this.httpClient.get<any>(this.url + url);
  }

  obtenerId(correo: any, data: any): Observable<any> {
    this.httpOptions.params = new HttpParams().set('username', correo.usuario);
    console.log('httpOptions', this.httpOptions)
    return this.httpClient.get<any>(this.url + 'medico/obtenerId/', this.httpOptions);
  }

  getInfoMedi(data: any): Observable<any> {
    console.log(data, ' data');
    console.log(data.jsonPk, ' data');
    return this.httpClient.get<any>(this.url + 'medico/getData?model=userMedico&params=user_id=' + data.jsonPk);
  }

  getInfoPaciente(data: any): Observable<any> {
    console.log(data, ' data');
    console.log(data.jsonPk, ' data');
    return this.httpClient.get<any>(this.url + 'paciente/getData?model=userPaciente&params=user_id=' + data.jsonPk);
  }

  getMedics() {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.url + 'medico/getData?model=userMedico').subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }


  sendParamsForSearch(data) {
    const dic = JSON.stringify(data);
    console.log(data, 'parseado');
    return this.httpClient.get(this.url + 'medico/searchMedic/?params=' + dic);
  }

  medicsByCity(city) {
    return this.httpClient.get(this.url + 'medico/getData?model=userMedico&params=ciudad=' + city);
  }

  recoveryPassword(data: any): Observable<any> {
    return this.httpClient.post<any>(this.url + 'paciente/emailResetMovil/', data);
  }

  getSpecialties() {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.url + 'movil/getEspecialidades/').subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  getDataAlerts() {
    const observable = new Observable(observer => {
      this.socket.on('calendar', async (data: any) => {
        if (data.estadoCita !== 'hold') {
          if (data.paciente.id === this.user.id || data.paciente === this.user.id) {
            console.log(data, 'DATA EN SOCKET');
            observer.next(data);
          }
        }
      });
    });
    return observable;
  }

  getDataDay(_data: any) {
    const observable = new Observable(observer => {
      this.socket.on('calendar', async (data) => {
        console.log(data, 'data socket');
        if (data.paciente === null || data.paciente === undefined
          || data.medico === null || data.medico === undefined) {
          if (_data.medico_id === data.medico || _data.medico_id === data.medico.id) {
            if (_data.fecha === data.fecha) {

              await this.getDayData(_data).then(d => {
                data.result = d;
              });
              observer.next(data);
            }
          }
        } else {
          if (data.medico.id === this.user.id || data.paciente.id === this.user.id
            || _data.medico_id === data.medico.id) {
            await this.getDayData(_data).then(d => {
              data.result = d;
            });
            observer.next(data);
          }
        }
      });
    });
    return observable;
  }

  getDayData(data) {
    console.log(data, ' datos con la fecha e ide');
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.url + this.urlGetInfo + 'estadoAgenda=available,estadoCita=hold,fecha=' + data.fecha)
        .subscribe(res => {
          resolve(res);
          console.log(res, 'get day data en servicio');
        }, (err) => {
          reject(err);
        });
    });
  }

  getDataPosponed(data) {
    console.log(data, ' datos con la fecha e ide');
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.url + this.urlGetInfo + 'estadoAgenda=available,estadoCita=hold,fecha=' + data.fecha)
        .subscribe(res => {
          resolve(res);
          console.log(res, 'get day data en servicio');
        }, (err) => {
          reject(err);
        });
    });
  }

  getMeetingNews(idPaciente: any) {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.url + this.urlGetInfo + 'estadoCita=new,paciente_id=' + idPaciente)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getDataPostponed(data) {
    console.log(data, ' for send');
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.url + this.urlGetInfo + 'estadoCita=postponed,paciente_id=' + data)
        .subscribe(res => {
          console.log(res, 'data pospuestas');
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getMeetingAccepted(data) {
    console.log(data, ' for send');
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.url + this.urlGetInfo + 'estadoCita=accepted,paciente_id=' + data)
        .subscribe(res => {
          console.log(res, 'data accepted desde el servidor');
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getMeetingData(idPaciente): Observable<any> {
    return this.httpClient.get<any>(this.url + this.urlGetInfo + 'estadoCita=accepted,paciente_id=' + idPaciente);
  }

  create(data: any): Observable<any> {
    console.log(data, ' data');
    return this.httpClient.post(this.url + 'agenda/createDiaryMedic', data)
  }

  deleteAppointment(idCita: any): Observable<any> {
    console.log(idCita, ' id cita eliminar');
    return this.httpClient.delete(this.url + 'agenda/updateDiaryMedic/' + idCita + '/');

  }

  updatePostponed(data: any): Observable<any> {
    console.log(data, ' data');
    return this.httpClient.patch(this.url + 'agenda/DiaryMedic', data)
  }

  partialUpdate(data: any): Observable<any> {
    console.log(data, ' data');
    return this.httpClient.patch(this.url + 'agenda/updateDiaryMedic/', data)
  }

  update(data: any): Observable<any> {
    return this.httpClient.put<any>(this.url + 'agenda/updateDiaryMedic/' + data.id + '/', data);
  }

  getIdMedicalHistory(idPaciente): Observable<any> {
    return this.httpClient.get<any>(this.url + 'historial/getData?model=HistorialMedico&params=paciente_id=' + idPaciente);
  }

  getPrescription(dni): Observable<any> {
    return this.httpClient.get<any>(this.urlMongoDB + 'receta/searchRecePac/' + dni);
  }

  getInfoProducts(ids: any): Observable<any> {
    return this.httpClient.get<any>(this.urlMongoDB + 'inventario/listarInventarios/' + ids);
  }

  convertStringToArrayOfObjects(dataToConvert: any) {
    let newJson = dataToConvert.replace(/([a-zA-Z0-9]+?):/g, '"$1":');
    newJson = newJson.replace(/'/g, '"');
    return JSON.parse(newJson);
  }


  getDesp(ids: any): Observable<any> {
    return this.httpClient.get<any>(this.urlMongoDB + 'despacho/searchDespa/' + ids);
  }

}
