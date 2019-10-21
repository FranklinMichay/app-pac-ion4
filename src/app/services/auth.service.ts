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
  httpOptions: any = {};
  private url = environment.apiURL1;
  private urlSocket = environment.socketUrl;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {
    //this.initSocketIo();
  }

  // initSocketIo() {
  //   const user = JSON.parse(localStorage.getItem('user')) ?
  //     JSON.parse(localStorage.getItem('user')) : {};
  //   this.socket = socketIo(this.urlSocket);
  //   this.socket.emit('init', { receiver: { _id: user.pk } });
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
        console.log(data, _data, 'data del antes del if');
        if (data.client == _data.pkPaciente && _data.fecha) {
          _data.fecha = data.fecha;
        }
        if (data.pkMedico === _data.pkMedico) {
          console.log(data.pkMedico, _data.pkMedico, 'entro en el if');
          await this.getDayData(_data).then(
            d => {
              data.result = d;
            });
          observer.next(data);
        }
      });
    });
    return observable;
  }

  getDayData(data: any) {
    console.log(data, ' for send');
    //data.fecha = !data.fecha ? '2019-08-14' : data.fecha;
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.url + 'agenda/getData?model=Agenda&params=' + data )
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  // sendNotify(data: Calendar) {
  //   console.log(data, 'in send notifi');
  //   this.socket.emit('calendar', data);
  // }

  getMeetingData(_data) {
    console.log(_data, 'data for get');
    const observable = new Observable(observer => {
      this.socket.on('response', async (data) => {
        console.log(_data, data, ' on redis response fuera del if');
        if (data.client === _data.pkPaciente) {
          await this.getMeetingNews(_data).then(
            d => {
              data.dataNews = d;
            });
          await this.getDataPostponed(_data).then(
            d => {
              data.dataPostponed = d;
            });

          await this.getMeetingAccepted(_data).then(
            d => {
              data.dataAccepted = d;
            });
          observer.next(data);
        }
      });
    });
    return observable;
  }

  getMeetingNews(data: any) {
    console.log(data, ' for send');
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.url + 'agenda/getData?model=Agenda&params=' + data )
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
      this.httpClient.get(this.url + 'agenda/getData?model=Agenda&params=' + data )
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getMeetingAccepted(data) {
    console.log(data, ' for send');
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.url + 'agenda/getData?model=Agenda&params=' + data )
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
}
