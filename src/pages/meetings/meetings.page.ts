import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AlertController, IonSlides, IonInfiniteScroll, ToastController } from '@ionic/angular';
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

  @ViewChild('slider', { static: true }) slider: IonSlides;

  @ViewChild('IonInfiniteScroll', { static: true }) infiniteScroll: IonInfiniteScroll;


  newMeetings = [];
  acceptedMeetings = [];
  currentTab: string = 'step1';
  idPaciente: any;
  postponedMeetings = [];
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

  numbers = [-1, 0, 1, 2];
  firstLoad = true;

  daysWeek = [
    { label: 'Dom.', selected: false, day: '' },
    { label: 'Lun.', selected: true, day: '' },
    { label: 'Mar.', selected: false, day: '' },
    { label: 'Mie.', selected: false, day: '' },
    { label: 'Jue.', selected: false, day: '' },
    { label: 'Vie.', selected: false, day: '' },
    { label: 'Sab.', selected: false, day: '' }];

  slideOpts = {
    initialSlide: 0
  };
  dataList = [];
  offset = 1;
  offsetc = 1;
  offsetp = 1;
  contScrollAccepted: any;
  contScrollCanceled: any;
  contScrollPostponed: any;

  constructor(
    private router: Router,
    public alertCtrl: AlertController,
    private auth: AuthService,
    private socket: Socket,
    private loadingCtrl: LoadingService,
    private route: ActivatedRoute,
    private dataService: DataService,
    public toastController: ToastController

  ) {



    this.currentYear = this.today.getFullYear();
    this.monthLabel = Info.months[this.today.getMonth()];
    this.currentMonth = this.today.getMonth();
    this.day = this.today.getDate();
    const index = this.today.getDay();
    this.setWeek(this.day, index);
    const user = JSON.parse(localStorage.getItem('userPaciente'));
    console.log(user, 'user meeting');
    this.idPaciente = user ? user.id : 1;
    console.log(this.idPaciente, 'id del paciente')
    console.log(this.day, 'dia para presentar');
    this.url = environment.url;

    if (this.connection !== undefined) {
      this.connection.unsubscribe();
      this.auth.removeListener('calendar');
    }
    this.connection = this.auth.getLastAppointment().subscribe((result: any) => {
      if (result.medico.fotoPerfil[0] !== 'h') {
        let foto = this.url + result.medico.fotoPerfil;
        result.medico.fotoPerfil = foto;
      }
      console.log(result, 'cita para pushear');
      if (result.estadoCita === 'accepted') {
        this.acceptedMeetings.push(result);
      } else if (result.estadoCita === 'canceled') {
        this.newMeetings.push(result);
        this.removeData(result.id);
      } else if (result.estadoCita === 'postponed') {
        this.postponedMeetings.push(result);
        this.removeData(result.id);
        this.changeDay(this.day)
      }
    }, (err) => {
      console.log(err, 'errores');
      console.log(err);
    });


  }

  ngOnInit() {

    // infinite scroll
    this.loadDataAccepted();
    this.loadDataCanceled();
    this.loadDataPostponed();
    //this.slider.slideTo(1, 0, false);
    const currentDate = this.getCurrentDate(this.day);
    console.log(currentDate, 'current date');
    //this.getData(currentDate);
  }

  loadDataAccepted(loadMore = false, event?) {

    setTimeout(() => {
      this.loadingCtrl.presentLoading();
      if (loadMore) {
        this.offset++;
      }
      const fields: any = {
        idPaciente: this.idPaciente,
        offset: this.offset,
        state: 'accepted'
      };

      this.auth.getDataScroolAccepted(fields).subscribe(d => {
        console.log(d, 'DATA SCROLL ACEPTED');
        d.map((el) => {
          if (el.medico.fotoPerfil !== null) {
            if (el.medico.fotoPerfil[0] !== 'h') {
              let foto = this.url + el.medico.fotoPerfil;
              el.medico.fotoPerfil = foto;
            }
          }

        });
        console.log(d, 'DATA SCROLL ACEPTED');
        this.contScrollAccepted = d;
        d.map((el) => {
          this.acceptedMeetings.push(el);
        });
        this.loadingCtrl.dismiss();
      });

      console.log(this.acceptedMeetings, 'accepted');
      if (event) {
        event.target.complete();
      }

      if (this.contScrollAccepted) {
        if (this.contScrollAccepted.length == 0) {
          console.log('no hay mas citas aceptadas', this.contScrollAccepted.length);
          this.presentToast();
          event.target.disabled = true;
        }
      }

    }, 1000);

  }

  loadDataPostponed(loadMore = false, event?) {
    if (loadMore) {
      this.offsetc++;
    }
    const fields: any = {
      idPaciente: this.idPaciente,
      offset: this.offset,
      state: 'postponed'
    };
    this.auth.getDataScroolPostponed(fields).subscribe(d => {
      d.map((el) => {
        if (el.medico.fotoPerfil !== null) {
          if (el.medico.fotoPerfil[0] !== 'h') {
            let foto = this.url + el.medico.fotoPerfil;
            el.medico.fotoPerfil = foto;
          }
        }
      });
      console.log(d, 'DATA SCROLL POSTPODEN');
      this.contScrollPostponed = d;
      d.map((el) => {
        this.postponedMeetings.push(el);
      });
    });
    console.log(this.postponedMeetings, 'pospuestas');
    if (event) {
      event.target.complete();
    }

    if (this.contScrollPostponed) {
      if (this.contScrollPostponed.length == 0) {
        console.log('no hay mas citas pospuestas ', this.contScrollPostponed.length);
        this.presentToast();
        event.target.disabled = true;
      }
    }
  }

  loadDataCanceled(loadMore = false, event?) {
    if (loadMore) {
      this.offsetc++;
    }
    const fields: any = {
      idPaciente: this.idPaciente,
      offset: this.offset,
      state: 'canceled'
    };
    this.auth.getDataScroolCanceled(fields).subscribe(d => {
      d.map((el) => {
        if (el.medico.fotoPerfil !== null) {
          if (el.medico.fotoPerfil[0] !== 'h') {
            let foto = this.url + el.medico.fotoPerfil;
            el.medico.fotoPerfil = foto;
          }
        }
      });
      console.log(d, 'DATA SCROLL CANCELED');
      this.contScrollCanceled = d;
      d.map((el) => {
        this.newMeetings.push(el);
      });
    });
    console.log(this.newMeetings, 'canceled');
    if (event) {
      event.target.complete();
    }

    if (this.contScrollCanceled) {
      if (this.contScrollCanceled.length == 0) {
        console.log('no hay mas citas canceladas', this.contScrollCanceled.length);
        this.presentToast();
        event.target.disabled = true;
      }
    }
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }
  // FINALIZA INFITE SCROLL

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
    const currentDate = this.getCurrentDate(this.day);
    console.log(currentDate, 'current date');
    //this.getData(currentDate);
  }

  nextSlide() {
    let newIndex;
    if (this.firstLoad) {
      this.firstLoad = false;
      return;
    }
    this.slider.getActiveIndex().then((index) => {
      newIndex = index;
      console.log(newIndex, 'active index next');
      newIndex--;
      this.numbers.push(this.numbers[this.numbers.length - 1] + 1);
      this.numbers.shift();
      this.slider.slideTo(newIndex, 0, false);
      console.log(`New status: ${this.numbers}`);
    });
  }

  prevSlide() {
    let newIndex;
    this.slider.getActiveIndex().then((index) => {
      newIndex = index;
      console.log(newIndex, 'active index prev');
      newIndex++;
      this.numbers.unshift(this.numbers[0] - 1);
      console.log(this.numbers.unshift(this.numbers[0] - 1), 'unshift');
      this.numbers.pop();
      this.slider.slideTo(newIndex, 0, false);
      console.log(`New status: ${this.numbers}`);
    });
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
  }

  getCurrentDate(day) {
    const month = this.currentMonth + 1;
    const m = (month < 10) ? ('0' + month) : month;
    const d = (day < 10) ? ('0' + day) : day;
    const date = this.currentYear + '-' + m + '-' + d;
    return date;
  }

  // getData(currentDate) {
  //   console.log(currentDate, 'la fecha de consulta ');
  //   this.acceptedMeetings = undefined;
  //   this.newMeetings = undefined;
  //   this.postponedMeetings = undefined;
  //   const fields: any = {
  //     idPaciente: this.idPaciente,
  //     fecha: currentDate
  //   };
  //   this.loadingCtrl.presentLoading();
  //   this.auth.getDataCanceled(fields).subscribe(d => {
  //     this.newMeetings = d;
  //     console.log(this.newMeetings, 'canceled');
  //     this.auth.getDataPostponed(fields).subscribe(d => {
  //       this.postponedMeetings = d;
  //       console.log(this.postponedMeetings, 'pospuestas');
  //       this.auth.getMeetingAccepted(fields).subscribe(d => {
  //         this.acceptedMeetings = d;
  //         console.log(this.acceptedMeetings, 'aceptadas');
  //       });
  //     });
  //   });
  //   this.loadingCtrl.dismiss();

  // }

  removeData(result) {
    _.remove(this.acceptedMeetings, function (n) {
      return n.id === result;
    });
  }

  changeDay(day) {
    console.log('cambio el dia');
    this.setLabel(day, this.currentMonth, this.currentYear);
    this.getDaysInMonth(this.currentMonth, this.currentYear);
    const currentDate = this.getCurrentDate(day);
    //this.getData(currentDate);
    this.daysWeek = _.map(this.daysWeek, (v, i) => {
      v.selected = (day === v.day) ? true : false
      return v;
    });
    this.day = day;
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

  onSlideChanged() {
    let currentIndex = this.slider.getActiveIndex();
    console.log("Current index is", currentIndex);
  }

  previousWeek() {
    this.prevSlide();
    const currentFirstDay = this.lastDataShowed.firstDay.value;
    if (currentFirstDay === 1 && this.currentMonth === 0) {
      //this.currentYear - 1
      this.currentYear = this.currentYear - 1
      this.currentMonth = 12;
    }
    this.currentMonth = (currentFirstDay === 1) ? this.currentMonth - 1 : this.currentMonth;
    const newDay = currentFirstDay === 1 ? this.getDaysInMonth(this.currentMonth, this.currentYear) : currentFirstDay - 1;
    const newIndex = this.lastDataShowed.firstDay.index === 0 ? 6 : this.lastDataShowed.firstDay.index - 1;
    this.setWeek(newDay, newIndex);
    this.changeDay(this.daysWeek[3].day || this.daysWeek[0].day || this.daysWeek[6].day);

  }

  nextWeek() {
    this.nextSlide();
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

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'No hay mas citas',
      duration: 2000,
      color: 'dark'
    });
    toast.present();
  }
}
