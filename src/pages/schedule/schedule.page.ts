import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Info } from '../../shared/mock/months';
import { LoadingService } from '../../app/services/loading.service';
import { AuthService } from '../../../src/app/services/auth.service'
import { GetMeetingPage } from '../get-meeting/get-meeting.page';
import * as _ from 'lodash';  // tslint:disable-line
import { NavController, NavParams, ModalController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  monthLabel: string;
  todayLabel: any;
  userData: any;
  disableBackBS = false;
  //DATOS DE DAY
  today = new Date();
  day: any;
  hours: any;
  info: any = { day: '1', month: 'january', year: '2019' };
  dateLabel: string = '';
  months = Info.months;
  currentMonth: any;
  currentYear: any;
  lastDay: any;
  hourCopy: any = [];
  medic: any = {};
  pacienteId: any;
  disableBackB = false;
  connection: any;
  selected: any;
  stateAgenda: any;
  h: any;
  loading: any;
  dataForModal: any;
  hoursAvailable = [];
  eventSource = [];
  calendar = {
    mode: 'month',
    currentDate: new Date()
  }
  idMed: any

  constructor(
    private router: Router,
    public navCtrl: NavController,
    public mdlCtrl: ModalController,
    public alertCtrl: AlertController,
    public toast: ToastController,
    private auth: AuthService,
    private loadingCtrl: LoadingService,
    private route: ActivatedRoute,
    private dataService: DataService

  ) {
    this.idMed = this.route.snapshot.paramMap.get('idMedico');
    console.log(this.idMed, 'id medico');
    this.medic = this.dataService.dataMedic
    console.log(this.medic, 'datos del medico');
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('user'));
    console.log(this.userData, 'datos del paciente');
    this.currentYear = this.today.getFullYear();
    this.monthLabel = Info.months[this.today.getMonth()];
    this.currentMonth = this.today.getMonth();
    this.showCalendar(this.currentYear, this.currentMonth);
    const user: any = JSON.parse(localStorage.getItem('user'));
    this.pacienteId = this.userData.user.id

    const year = this.currentYear;
    const month = this.currentMonth;
    const day = this.today.getDate();
    if (day === this.today.getDate() && year === this.today.getFullYear() && month === this.today.getMonth()) {
      this.dateLabel = 'Hoy'
    } else {
      this.dateLabel = day + '/' + this.months[month] + '/' + year;
    }
    this.getDaysInMonth(this.currentMonth, this.currentYear);
    this.getDayInfo(year, month, day);
    const _info = {
      medico_id: this.medic.id,
      fecha: formatDate(this.today, 'yyyy-MM-dd', 'en-US'),
      paciente_id: this.pacienteId
    };
    this.disableBack(year, month, day);
    this.getDataDay(formatDate(this.today, 'yyyy-MM-dd', 'en-US'));
    // this.connection = this.auth.getDataDay(_info).subscribe((result: any) => {
    //   console.log(result, 'agenda from api in day');
    //   if (result.estadoAgenda !== 'unavailable' || result.estadoCita !== 'accepted' || result.estadoCita !== 'new'
    //   || result.estadoCita !== 'postponed' || result.estadoCita !== 'denied') {
    //     this.hoursAvailable.push(result);
    //   }

    //   //this.loadingCtrl.dismiss();
    // }, (err) => {
    //   console.log(err, 'errores');
    //   console.log(err);
    // });

  }

  returnHome() {
    this.router.navigate(['home']);
  }

  showCalendar(year, month) {
    let firstDay = (new Date(year, month)).getDay();
    let tbl = document.getElementById("calendar-body");
    tbl.innerHTML = "";
    let date = 1;
    for (let i = 0; i < 6; i++) {
      let row = document.createElement("tr");
      row.className = 'colm';

      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          let cell = document.createElement("td");
          cell.className = 'cell';
          let cellText = document.createTextNode("");
          cell.appendChild(cellText);
          row.appendChild(cell);
        }
        else if (date > this.daysInMonth(month, year)) {
          break;
        } else {
          let cell = document.createElement("td");
          cell.className = 'cell';
          cell.id = date.toString();
          if (this.disableEvent(year, month, date)) {
            cell.addEventListener('click', () => {
              this.openDay(cell);
            });
          }
          let cellText = document.createTextNode(date.toString());
          if (date === this.today.getDate() && year === this.today.getFullYear() && month === this.today.getMonth()) {
            cell.classList.add("bg-info");
            this.selected = cell;
            cell.addEventListener('click', () => {
              this.openDay(cell);
            });
          }
          if (j === 0) {
            cell.classList.add("bg-sunday");
          }
          cell.appendChild(cellText);
          row.appendChild(cell);
          date++;
        }
      }
      tbl.appendChild(row);
    }
  }

  getDataDay(date) {
    this.loadingCtrl.presentLoading();
    this.hoursAvailable = [];
    console.log(this.medic, 'verificar id');
    let url = 'estadoAgenda=available,estadoCita=hold,fecha=' + date + ',medico_id=' + this.medic.id;
    this.auth.getByUrlCustom(url).subscribe((result: any) => {
      console.log(result, 'data del dia');
      this.hoursAvailable = result;
      this.loadingCtrl.dismiss();
      //this.connection.unsubscribe();
      const _info = {
        medico_id: this.medic.id,
        fecha: formatDate(this.today, 'yyyy-MM-dd', 'en-US'),
        paciente_id: this.pacienteId
      };
      this.connection = this.auth.getDataDay(_info).subscribe((result: any) => {
        console.log(result, 'agenda from api in day');
        if (result.estadoCita === 'accepted') {
          this.deleteHourDay(result.hora);
        } else if (result.estadoCita !== 'new'
          || result.estadoCita !== 'postponed' || result.estadoCita !== 'denied') {
          this.controlExpressShedule(result);
        }
      }, (err) => {
        console.log(err, 'errores');
        console.log(err);
      });
    });
  }

  controlExpressShedule(data) {
    if (data.estadoAgenda === 'available') {
      this.hoursAvailable.push(data);
      this.hoursAvailable = _.uniqBy(this.hoursAvailable, function (d) {
        return d.hora;
      });

      this.hoursAvailable = _.orderBy(this.hoursAvailable, ['hora'], ['asc']);

    } else if (data.estadoAgenda === 'unavailable') {
      console.log('unavailable');

      this.deleteHourDay(data.hora);
    }
  }

  getDayInfo(year, month, day) {
    //this.loadingCtrl.presentLoading();
    month = month + 1;
    const m = (month < 10) ? ('0' + month) : month;
    const d = (day < 10) ? ('0' + day) : day;
    const date = year + '-' + m + '-' + d;
    console.log(date, 'esta es la otra fecha');
    const _info = {
      medico_id: this.medic.id,
      fecha: formatDate(new Date(date), 'yyyy-MM-dd', 'en-US'),
      paciente_id: this.pacienteId
    };

    //this.auth.sendNotify({ fecha: date, client: this.pacienteId, idMedico: this.medic.id });
  }


  daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
  }

  openDay(index: any) {
    console.log(index, 'index');
    this.selected.classList.remove('bg-info');
    index.classList.add("bg-info");
    this.selected = index;
    let date = this.currentYear + '/' + (this.currentMonth + 1) + '/' + index.textContent;
    this.today = new Date(date);
    console.log(date, 'fecha consultar');
    this.getDayInfo(this.currentYear, this.currentMonth, index.textContent)
    this.getDataDay(formatDate(this.today, 'yyyy-MM-dd', 'en-US'));
  }

  next() {
    this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
    this.currentMonth = (this.currentMonth + 1) % 12;
    this.monthLabel = Info.months[this.currentMonth];
    this.showCalendar(this.currentYear, this.currentMonth);
    //this.showLabelUndo(this.currentYear, this.currentMonth);
    this.disableBackS(this.currentYear, this.currentMonth);
  }

  previous() {
    this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
    this.monthLabel = Info.months[this.currentMonth];
    this.showCalendar(this.currentYear, this.currentMonth);
    //this.showLabelUndo(this.currentYear, this.currentMonth);
    this.disableBackS(this.currentYear, this.currentMonth);
  }

  disableBackS(year, month) {
    const today = new Date();
    //console.log(year, today.getFullYear(), month, today.getMonth(), 'los trues');
    if (year <= today.getFullYear() && month <= today.getMonth()) {
      this.disableBackBS = false;
    } else {
      this.disableBackBS = true;
    }
  }

  disableEvent(year, month, day) {
    const today = new Date();
    //console.log(year, today.getFullYear(), month, today.getMonth(), day, today.getDate(), 'los trues');
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
      this.dateLabel = day + '/' + this.months[month] + '/' + year;
    }
  }

  getDaysInMonth(month, year) {
    this.lastDay = new Date(year, month + 1, 0).getDate();
    return this.lastDay;
  };

  getMeeting(hour) {
    console.log(hour, 'hora para agendar');
    const _month = this.currentMonth + 1;
    const m = (_month < 10) ? ('0' + _month) : _month;
    const d = (this.day < 10) ? ('0' + this.day) : this.day;
    const date = this.currentYear + '-' + m + '-' + d;
    const _info = {
      fecha: hour.fecha,
      hora: hour.hora,
      medic: this.medic,
      centroMedico: hour.centroMedico.nombre,
      idCentroMed: hour.centroMedico.id
    }
    console.log(_info, 'INFO PARA AGENDAR CITA');
    this.dataForModal = _info;
    console.log(this.dataForModal, 'Info para el modal agendar cita');
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.mdlCtrl.create({
      component: GetMeetingPage,
      cssClass: 'css-modal',
      componentProps: {
        hour: this.dataForModal
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        console.log(data, 'data del dismis meeting');
        const horaDelete = data.data.data.hora
        console.log(horaDelete, 'hora para eliminar');
        console.log(this.hoursAvailable, 'agenda antes');
        this.deleteHourDay(horaDelete);
        console.log(this.hoursAvailable, 'agenda despues');

      });
    return await modal.present();
  }

  deleteHourDay(hour: any) {
    _.remove(this.hoursAvailable, function (n) {
      console.log(hour, 'hora a eliminar');
      return n.hora === hour;
    });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

}
