import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../../src/app/services/auth.service'
import { Info } from '../../shared/mock/months';
import * as _ from 'lodash';  
import { Socket } from 'ngx-socket-io';

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
  accepted: any;
  news: any;
  postponed: any;
  posp: boolean = false;
  loading: any;

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
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private auth: AuthService,
    private socket: Socket

  ) { 
    this.currentYear = this.today.getFullYear();
    this.monthLabel = Info.months[this.today.getMonth()];
    this.currentMonth = this.today.getMonth();
    this.day = this.today.getDate();
    const index = this.today.getDay();
    this.setWeek(this.day, index);

    console.log('ionViewDidLoad MeetingsPage 1');
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user, 'user');
    this.idPaciente = user ? user.id : 1;
    console.log(this.idPaciente, 'id del paciente')
    this.getData();
    // this.getDataNews();
    // this.getDataAccept();
    // this.getDataPostponed();
  }

  ngOnInit() {
    this.getDataAccept();
  }

  getData() {
    this.presentLoading();
    const fields: any = this.idPaciente;
    this.connection = this.auth.getMeetingDataIo(fields).subscribe((data: any) => {
      console.log(data, 'data del server');
      if (data.dataAccepted && data.dataNews && data.dataPostponed) {
        console.log(data, 'data del if');
        this.acceptedMeetings = data;
        this.newMeetings = data;
        this.postponedMeetings = data;
        this.filterData(this.currentYear, this.currentMonth, this.day);
      }
      this.loading.dismiss();
    }, (err) => {
      
      this.loading.dismiss();
      console.log(err);
    });
    this.auth.sendResponse(this.idPaciente);
  }

  changeDay(day) {
    
    this.setLabel(day, this.currentMonth, this.currentYear);
    this.getDaysInMonth(this.currentMonth, this.currentYear);
    this.daysWeek = _.map(this.daysWeek, (v, i) => {
      v.selected = (day === v.day) ? true : false
      return v;
    });
    this.day = day;
    console.log(this.day, 'dia seleccionado');
    this.filterData(this.currentYear, this.currentMonth, day);
  }

  filterData(year, month, day) {
    const _month = month + 1;
    const m = (_month < 10) ? ('0' + _month) : _month;
    const d = (day < 10) ? ('0' + day) : day;
    const date = year + '-' + m + '-' + d;
    this.accepted = _.filter(this.acceptedMeetings, (o: any) => { return o.fecha === date; });
    this.news = _.filter(this.newMeetings, (o: any) => { return o.fecha === date; });
    this.postponed = _.filter(this.postponedMeetings, (o: any) => { return o.fecha === date; });
    console.log(this.accepted, 'aceptadas');
    console.log(this.news, 'agendadas');
    console.log(this.postponed, 'pospuestas');
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
      this.currentYear + 1
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

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      message: 'Obteniendo Datos...',
    });
    return await this.loading.present();
  }

  getDayInfo(year, month, day) {
    this.presentLoading();
    month = month + 1;
    const m = (month < 10) ? ('0' + month) : month;
    const d = (day < 10) ? ('0' + day) : day;
    const date = year + '-' + m + '-' + d;
    const _info = {
      idMedico: this.medic.id,
      fecha: date,
      idPaciente: this.pacienteId
    };
    this.auth.getDataDay(_info).subscribe((result: any) => {
      console.log(result, 'agenda from api in day');
      if (result) {
        this.setData(result);
      }
      this.loading.dismiss();
    }, (err) => {
      
      this.loading.dismiss();
      
      this.hours = this.hourCopy;
      console.log(err);
    });
    this.auth.sendNotify({ fecha: date, client: this.pacienteId, idMedico: _info.idMedico });
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


  getDataNews() {
    let url = 'estadoCita=new,paciente_id=' + this.idPaciente; 
    this.auth.getByUrlCustom(url).subscribe((result: any) => {
      this.newMeetings = result;
      console.log(this.newMeetings, 'Citas agendadas');
    })
  }

  getDataAccept() {
    let url = 'estadoCita=accepted,paciente_id=' + this.idPaciente; 
    this.auth.getByUrlCustom(url).subscribe((result: any) => {
      this.acceptedMeetings = result;
      console.log(this.acceptedMeetings, 'Citas aceptadas');
    })
  }

  getDataPostponed() {
    let url = 'estadoCita=postponed,paciente_id=' + this.idPaciente; 
    this.auth.getByUrlCustom(url).subscribe((result: any) => {
      this.postponedMeetings = result;
      console.log(this.postponedMeetings, 'Citas pospuestas');
    })
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
    console.log(medic, state, posponed ,'info para ');
    this.router.navigate(['detail-medic', state, posponed], {state:medic} );
  }


}
