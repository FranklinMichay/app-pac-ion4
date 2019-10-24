import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Calendar } from '../../shared/model/calendar';
import * as socketIo from 'socket.io-client';

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

  fechaMeeting: any;


  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {
    this.initSocketIo();
    this.user = JSON.parse(localStorage.getItem('user'));
    this.idPaciente = this.user.id;
    console.log(this.idPaciente, 'id paciente en rest');

  }

  initSocketIo() {
    const user = JSON.parse(localStorage.getItem('user')) ?
      JSON.parse(localStorage.getItem('user')) : {};

    this.socket = socketIo(this.urlSocket);
    console.log(this.urlSocket, 'url enviada');
    this.socket.emit('init', { receiver: { _id: user.id } });
  }

  sendNotify(data: Calendar) {
    console.log(data, 'in send notifi');
    this.socket.emit('calendar', data);
  }

  sendResponse(data: Response) {
    console.log(data, 'in send response client');
    this.socket.emit('response', data);
  }

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

  getByUrlCustom(url): Observable<any> {
    this.fechaMeeting = url;

    return this.httpClient.get<any>(this.url + 'agenda/getData?model=Agenda&params=' + url);
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

  getSpecialties() {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.url + 'movil/getEspecialidades/').subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      });
    });
  }

  getDataDay(_data: any) {
    console.log(_data, 'data for get');
    const observable = new Observable(observer => {
      this.socket.on('calendar', async (data) => {
        if (data.medico === this.user.id || data.paciente === this.user.id || _data.medico_id === data.medico) {
          console.log('DATO EXITOSO');
          await this.getDayData(_data).then(
            d => {
              data.result = d;
            });
          observer.next(data);
        }
        //console.log(data, _data, 'data del antes del if');
      });
    });
    return observable;
  }
  //let fields = date + ',medico_id=' + this.medic.id; 
  getMeetingDataIo(_data) {
    console.log(_data, 'data for get');
    const observable = new Observable(observer => {
      this.socket.on('response', async (data) => {
        console.log(_data, data, ' on redis response fuera del if');
        if (data.client === _data.idPaciente) {
          await this.getMeetingNews(_data).then(
            d => {
              
              data = d;
            });
          await this.getDataPostponed(_data).then(
            d => {
              data = d;
            });

          await this.getMeetingAccepted(_data).then(
            d => {
              data = d;
            });
          observer.next(data);
        }
      });
    });
    return observable;
  }

  //let url = 'estadoAgenda=available,estadoCita=hold,fecha=' + date + ',medico_id=' + this.medic.id; 
  getDayData(data) {
    console.log(data, ' datos con la fecha e ide');
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.url +  this.urlGetInfo + 'estadoAgenda=available,estadoCita=hold,fecha='+ data.fecha)
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

  getMeetingAccepted(data){
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

}
