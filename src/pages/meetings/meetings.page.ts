import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../../src/app/services/auth.service'
import { Info } from '../../shared/mock/months';
import * as _ from 'lodash';
import { Socket } from 'ngx-socket-io';
import { LoadingService } from '../../app/services/loading.service';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.page.html',
  styleUrls: ['./meetings.page.scss'],
})
export class MeetingsPage implements OnInit {


  newMeetings: any;
  acceptedMeetings: any;
  currentTab: string = 'step1';
  idPaciente: any;
  postponedMeetings: any;
  connection: any;
  pkCentroMed: any = 1;
  monthLabel: string;
  currentYear: any;
  scheduled: any;
  today = new Date();

  currentMonth: any;
  day: any;
  disableBackBS = false;
  disableBackB = false;
  dateLabel: string = '';
  lastDay: any;
  months = Info.months;
  medic: any;
  pacienteId: any;
  hours: any;
  hourCopy: any = [];
  lastDataShowed: any = {};
  accepted = [];
  news: any;
  postponed: any;
  posp: boolean = false;
  loading: any;
  dataDelete: any;
  url: any;

  daysWeek = [
    { label: 'Dom.', selected: false, day: '' },
    { label: 'Lun.', selected: true, day: '' },
    { label: 'Mar.', selected: false, day: '' },
    { label: 'Mie.', selected: false, day: '' },
    { label: 'Jue.', selected: false, day: '' },
    { label: 'Vie.', selected: false, day: '' },
    { label: 'Sab.', selected: false, day: '' }];

  constructor(
    private router: Router,
    //public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private auth: AuthService,
    private socket: Socket,
    private loadingCtrl: LoadingService,
    private route: ActivatedRoute,
    private dataService: DataService

  ) {
    this.currentYear = this.today.getFullYear();
    this.monthLabel = Info.months[this.today.getMonth()];
    this.currentMonth = this.today.getMonth();
    this.day = this.today.getDate();
    const index = this.today.getDay();
    this.setWeek(this.day, index);
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user, 'user');
    this.idPaciente = user ? user.id : 1;
    console.log(this.idPaciente, 'id del paciente')
    console.log(this.day, 'dia para presentar');
    this.url = environment.url;
    if (this.connection !== undefined) {
      this.connection.unsubscribe();
      this.auth.removeListener('calendar');
    }


  }

  ngOnInit() {
    //debugger
    //this.getAllData(this.idPaciente);
    //this.changeDay(this.day)
    const currentDate = this.getCurrentDate(this.day);
    this.getData(currentDate);
  }

  ionViewWillEnter() {

    if (Object.keys(this.dataService.dataDelete).length !== 0) {
      this.dataDelete = this.dataService.dataDelete;
      this.deleteData(this.dataDelete.data.data.id);
      this.dataService.dataDelete = {}
    } else if (Object.keys(this.dataService.dataCancelPosponed).length !== 0) {
      this.dataDelete = this.dataService.dataCancelPosponed;
      this.deleteDataPosponed(this.dataDelete.data.data.id);
      this.dataService.dataCancelPosponed = {}
    } else {
      if (Object.keys(this.dataService.idAcceptPosponed).length !== 0) {
        this.dataDelete = this.dataService.idAcceptPosponed;
        this.deleteDataPosponed(this.dataDelete.data.data.id);
        this.dataService.idAcceptPosponed = {}
      }
    }
  }

  deleteData(id) {
    console.log(this.accepted, 'datos ANTES DELETE');
    _.remove(this.accepted, function (n) {
      console.log(id, 'DELETE');
      return n.id === id;
    });
    _.remove(this.acceptedMeetings, function (n) {
      console.log(id, 'DELETE');
      return n.id === id;
    });
    //console.log(this.acceptedMeetings, 'datos delete filtrados');
  }

  deleteDataPosponed(id) {
    console.log(this.postponed, 'datos posponed ANTES DELETE');
    _.remove(this.postponed, function (n) {
      console.log(id, 'DELETE');
      return n.id === id;
    });

    _.remove(this.postponedMeetings, function (n) {
      console.log(id, 'DELETE');
      return n.id === id;
    });
    //console.log(this.acceptedMeetings, 'datos delete filtrados');
  }

  getCurrentDate(day) {
    // const day = this.lastDataShowed.firstDay.value;´
    // const day = this.today.getDate();
    const month = this.currentMonth + 1;
    const m = (month < 10) ? ('0' + month) : month;
    const d = (day < 10) ? ('0' + day) : day;
    const date = this.currentYear + '-' + m + '-' + d;
    // const _lastDay = this.lastDataShowed.lastDay.value;
    // const dateEnd = this.currentYear + '-' + m + '-' + _lastDay;
    return date;
  }

  getData(currentDate) {
    console.log(currentDate, 'la fecha de consulta ');

    this.acceptedMeetings = undefined;
    this.newMeetings = undefined;
    this.postponedMeetings = undefined;
    this.loadingCtrl.presentLoading();
    const fields: any = {
      idPaciente: this.idPaciente,
      fecha: currentDate
    };

    this.auth.getMeetingAccepted(fields).subscribe((d: any) => {
      this.acceptedMeetings = d;
      console.log(this.acceptedMeetings, 'aceptadas');

      this.auth.getDataPostponed(fields).subscribe((d: any) => {
        this.postponedMeetings = d;
        console.log(this.postponedMeetings, 'pospuestas');
        this.auth.getDataCanceled(fields).subscribe((d: any) => {
          this.newMeetings = d;
          console.log(this.newMeetings, 'canceled');
          this.loadingCtrl.dismiss();
        });

      });
    });

 

    if (this.connection !== undefined) {
      this.connection.unsubscribe();
      this.auth.removeListener('calendar');
    }
    this.connection = this.auth.getDataAlerts().subscribe((result: any) => {
      if (result.medico.fotoPerfil[0] !== 'h') {
        let foto = this.url + result.medico.fotoPerfil;
        result.medico.fotoPerfil = foto;
      }
      //debugger;
      console.log(result, 'cita para pushear');
      if (result.estadoCita === 'accepted') {
        this.acceptedMeetings.push(result);
        //this.accepted.push(result);
      } else if (result.estadoCita === 'canceled') {
        this.newMeetings.push(result);
        //this.news.push(result);
        this.removeData(result.id);
      } else if (result.estadoCita === 'postponed') {
        this.postponedMeetings.push(result);
        //this.postponed.push(result);
        this.removeData(result.id);
      }
    }, (err) => {
      console.log(err, 'errores');
      console.log(err);
    });
  }

  getAllData(patientId) {
    this.loadingCtrl.presentLoading();
    const url = `paciente_id=${patientId},estadoCita=newORacceptedORpostponedORcanceled`;
    this.auth.getByUrlCustom(url).subscribe(result => {
      console.log(result, 'todas las horas del paciente');
      this.acceptedMeetings = _.filter(result, function (o) { return o.estadoCita === 'accepted'; });
      this.newMeetings = _.filter(result, function (o) { return o.estadoCita === 'canceled'; });
      this.postponedMeetings = _.filter(result, function (o) { return o.estadoCita === 'postponed'; });
      this.filterData(this.currentYear, this.currentMonth, this.day);
      // console.log(this.acceptedMeetings, 'aceptadas');
      console.log(this.newMeetings, 'canceled');
      // console.log(this.postponedMeetings, 'postponed');
      this.loadingCtrl.dismiss();
    });

    if (this.connection !== undefined) {
      this.connection.unsubscribe();
      this.auth.removeListener('calendar');
    }
    this.connection = this.auth.getDataAlerts().subscribe((result: any) => {
      if (result.medico.fotoPerfil[0] !== 'h') {
        let foto = this.url + result.medico.fotoPerfil;
        result.medico.fotoPerfil = foto;
      }
      //debugger;
      console.log(result, 'cita para pushear');
      if (result.estadoCita === 'accepted') {
        this.acceptedMeetings.push(result);
        this.accepted.push(result);
      } else if (result.estadoCita === 'canceled') {
        this.newMeetings.push(result);
        this.news.push(result);
        this.removeData(result.id);
      } else if (result.estadoCita === 'postponed') {
        this.postponedMeetings.push(result);
        this.postponed.push(result);
        this.removeData(result.id);
      }
    }, (err) => {
      console.log(err, 'errores');
      console.log(err);
    });
  }

  removeData(result) {
    // _.remove(this.accepted, function (n) {

    //   return n.id === result;
    // });
    _.remove(this.acceptedMeetings, function (n) {

      return n.id === result;
    });
  }

  changeDay(day) {
    console.log('cambio el dia');
    this.setLabel(day, this.currentMonth, this.currentYear);
    this.getDaysInMonth(this.currentMonth, this.currentYear);
    const currentDate = this.getCurrentDate(day);
    this.getData(currentDate);
    this.daysWeek = _.map(this.daysWeek, (v, i) => {
      v.selected = (day === v.day) ? true : false
      return v;
    });
    this.day = day;
    // console.log(this.day, 'dia seleccionado');
    //this.filterData(this.currentYear, this.currentMonth, day);
  }

  filterData(year, month, day) {
    const _month = month + 1;
    const m = (_month < 10) ? ('0' + _month) : _month;
    const d = (day < 10) ? ('0' + day) : day;
    const date = year + '-' + m + '-' + d;
    _.filter(this.acceptedMeetings, (o: any) => { return o.fecha === date; });
    _.filter(this.newMeetings, (o: any) => { return o.fecha === date; });
    _.filter(this.postponedMeetings, (o: any) => { return o.fecha === date; });
  }

  previousWeek() {
    const currentFirstDay = this.lastDataShowed.firstDay.value;
    if (currentFirstDay === 1 && this.currentMonth === 0) {
      this.currentYear - 1
      this.currentMonth = 12;
    }
    this.currentMonth = (currentFirstDay === 1) ? this.currentMonth - 1 : this.currentMonth;
    const newDay = currentFirstDay === 1 ? this.getDaysInMonth(this.currentMonth, this.currentYear) : currentFirstDay - 1;
    const newIndex = this.lastDataShowed.firstDay.index === 0 ? 6 : this.lastDataShowed.firstDay.index - 1;
    this.setWeek(newDay, newIndex);
    this.changeDay(this.daysWeek[3].day || this.daysWeek[0].day || this.daysWeek[6].day);
  }

  nextWeek() {

    const currentLastDay = this.lastDataShowed.lastDay.value;
    if (currentLastDay === this.lastDay && this.currentMonth === 11) {
      this.currentYear = this.currentYear + 1;
    }
    this.currentMonth = (currentLastDay === this.lastDay) ? (this.currentMonth + 1) % 12 : this.currentMonth;
    const newDay = this.lastDay === currentLastDay ? 1 : currentLastDay + 1;
    const newIndex = this.lastDataShowed.lastDay.index === 6 ? 0 : this.lastDataShowed.lastDay.index + 1;
    this.setWeek(newDay, newIndex);

    this.changeDay(this.daysWeek[3].day || this.daysWeek[0].day || this.daysWeek[6].day);
  }

  setWeek(day, index) {
    console.log(day, 'dia', index, 'index', this.currentMonth, this.currentYear, 'data showed');
    let dayAux = day;
    let dayAux1 = day;
    let i = index;
    let j = index;
    this.getDaysInMonth(this.currentMonth, this.currentYear);
    this.daysWeek = _.map(this.daysWeek, (v, i) => {
      v.selected = (i === index) ? true : false
      return v;
    });
    for (; i < 7; i++) {
      console.log('this. last day', this.lastDay);
      if (dayAux <= this.lastDay) {
        this.daysWeek[i].day = dayAux;
        this.lastDataShowed.lastDay = {
          index: i,
          value: dayAux
        }
        dayAux += 1;
      } else {
        this.daysWeek[i].day = '';
      }
    }
    for (; j >= 0; j--) {
      if (day === 1) {
        this.daysWeek[j].day = '';
        this.daysWeek[index].day = day;
        this.lastDataShowed.firstDay = {
          index: index,
          value: day
        }
      }
      else if (dayAux1 >= 1) {
        this.daysWeek[j].day = dayAux1;
        this.lastDataShowed.firstDay = {
          index: j,
          value: dayAux1
        }
        dayAux1 -= 1;
      } else {
        this.daysWeek[j].day = '';
      }
    }
  }

  daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
  }

  openDay(index: any) {
    this.getDayInfo(this.currentYear, this.currentMonth, index)
  }

  next() {
    this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
    this.currentMonth = (this.currentMonth + 1) % 12;
    this.monthLabel = Info.months[this.currentMonth];
    this.setWeek(this.currentYear, this.currentMonth);
    //this.showLabelUndo(this.currentYear, this.currentMonth);
    this.disableBackS(this.currentYear, this.currentMonth);
  }

  previous() {
    this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
    this.monthLabel = Info.months[this.currentMonth];
    this.setWeek(this.currentYear, this.currentMonth);
    //this.showLabelUndo(this.currentYear, this.currentMonth);
    this.disableBackS(this.currentYear, this.currentMonth);
  }

  disableBackS(year, month) {
    const today = new Date();
    console.log(year, today.getFullYear(), month, today.getMonth(), 'los trues');
    if (year <= today.getFullYear() && month <= today.getMonth()) {
      this.disableBackBS = false;
    } else {
      this.disableBackBS = true;
    }
  }

  disableEvent(year, month, day) {
    const today = new Date();
    console.log(year, today.getFullYear(), month, today.getMonth(), day, today.getDate(), 'los trues');
    if (year <= today.getFullYear() && month <= today.getMonth() && day <= today.getDate()) {
      return false;
    } else {
      return true;
    }
  }
  //metodos de Day
  disableBack(year, month, day) {
    const today = new Date();
    if (year <= today.getFullYear() && month <= today.getMonth() && day <= today.getDate()) {
      this.disableBackB = false;
    } else {
      this.disableBackB = true;
    }
  }
  setLabel(day, month, year) {
    if (parseInt(day) === this.today.getDate() && year === this.today.getFullYear() && month === this.today.getMonth()) {
      this.dateLabel = 'Hoy'
    } else {
      this.dateLabel = day + ' - ' + this.months[month] + ' - ' + year;
    }
  }

  getDaysInMonth(month, year) {
    console.log('month yar', month, year);
    this.lastDay = new Date(year, month + 1, 0).getDate();
    return this.lastDay;
  };

  getDayInfo(year, month, day) {
    month = month + 1;
    const m = (month < 10) ? ('0' + month) : month;
    const d = (day < 10) ? ('0' + day) : day;
    const date = year + '-' + m + '-' + d;
    const _info = {
      idMedico: this.medic.id,
      fecha: date,
      idPaciente: this.pacienteId
    };

    if (this.connection !== undefined) {
      this.connection.unsubscribe();
      this.auth.removeListener('calendar');
    }
    this.connection = this.auth.getDataDay(_info).subscribe((result: any) => {
      console.log(result, 'agenda from api in day');
      if (result) {
        this.setData(result);
      }
    }, (err) => {
      this.hours = this.hourCopy;
      console.log(err);
    });
    //this.auth.sendNotify({ fecha: date, client: this.pacienteId, idMedico: _info.idMedico });
  }

  setData(data: any) {
    this.hours = [];
    if (_.isEmpty(data)) {
      this.hours = null;
    } else {
      _.forEach(data, (element) => {
        console.log(element, 'element');

        let newData: any = element;
        if (!element.id) {
          newData.state = 'Disponible'
          this.hours.push(newData);
        }
      });
    }
  }

  changeTab(tab: string) {
    this.currentTab = tab;
    if (tab === 'step1') {
    }
    if (tab === 'step2') {
    }
  }

  returnHome() {
    this.router.navigate(['home']);
  }

  goToDetails(medic, state, posponed) {
    console.log(medic, state, posponed, 'info para agendar');
    this.router.navigate(['detail-medic', state, posponed], { state: medic });
  }


  initSockets(day) {
    this.day = day;
    const dataConfig = {
      fecha: formatDate(new Date(this.currentYear, this.currentMonth, day), 'yyyy-MM-dd', 'en-US'),
      id: this.idPaciente
    }
    if (this.connection !== undefined) {
      this.connection.unsubscribe();
      this.auth.removeListener('calendar');
    }
    this.connection = this.auth.getDataDay(dataConfig).subscribe((result: any) => {
      console.log(result, 'socket....');
    });
  }
}
