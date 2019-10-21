import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Info } from '../../shared/mock/months';

//import { DayPage } from '../day/day';
import { AuthService } from '../../../src/app/services/auth.service'
import { GetMeetingPage } from '../get-meeting/get-meeting.page';
import * as _ from 'lodash';  // tslint:disable-line
import { HomePage } from '../home/home.page';
import { NavController, NavParams, ModalController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  monthLabel: string;
  todayLabel: any;
  medicS: any;
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
  pkMedico: any;
  medic: any = {};
  pacienteId: any;
  disableBackB = false;
  connection: any;
  selected: any;
  stateAgenda: any;
  h: any;
  loading: any;
  dataForModal: any;
  hoursAvailable: any;
  eventSource = [];
  calendar = {
    mode: 'month',
    currentDate: new Date()
  }

  

  constructor(
    private router: Router,
    public navCtrl: NavController,
    public mdlCtrl: ModalController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toast: ToastController,
    private auth: AuthService,
    
  ) { 
    this.medic = this.router.getCurrentNavigation().extras.state;
    console.log(this.medic, 'lo que traigo de perfil de medico');
    this.hourCopy = _.cloneDeep(Info.hours);
  }

  ngOnInit() {

    this.getDataDay(formatDate(this.today, 'yyyy-MM-dd', 'en-US'));
    this.userData = JSON.parse(localStorage.getItem('user'));
    console.log(this.userData, 'datos del paciente');
    //formatDate(this.today, 'yyyy-MM-dd', 'en-US')
    this.currentYear = this.today.getFullYear();
    this.monthLabel = Info.months[this.today.getMonth()];
    this.currentMonth = this.today.getMonth();
    
    
    //this.medic = this.navParams.get('medic');
    this.showCalendar(this.currentYear, this.currentMonth);
    console.log(this.medicS, 'medic app');
    //DATOS DE DAY
    console.log(this.hours, 'hours para SHEDULE');
    const user: any = JSON.parse(localStorage.getItem('user'));
    this.pacienteId = user ? user.pk : 1;
    console.log(this.info, 'info donde veo el pk');
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
    this.disableBack(year, month, day);
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      message: 'Obteniendo Datos...',
    });
    return await this.loading.present();
  }

  onEventSelected() {

  }

  onViewTitleChanged() {

  }

  onTimeSelected(){

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
    console.log(this.medic, 'verificar id');
    let url = 'estadoAgenda=available,estadoCita=hold,fecha=' + date + ',medico_id=' + this.medic.id; 
    this.hoursAvailable = this.auth.getByUrlCustom(url).subscribe((result: any) => {
      console.log(result, 'data del dia');
      this.hoursAvailable = result;
      
    })
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
    this.getDataDay(formatDate(this.today, 'yyyy-MM-dd', 'en-US'));
    
    //this.getDayInfo(this.currentYear, this.currentMonth, index.textContent)
    //this.openDay(this.cell.classList.add("bg-info"));


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

  getDayInfo(year, month, day) {
    //this.loading.present()
    month = month + 1;
    const m = (month < 10) ? ('0' + month) : month;
    const d = (day < 10) ? ('0' + day) : day;
    const date = year + '-' + m + '-' + d;
    const _info = {
      pkMedico: this.medic.id,
      fecha: date,
      pkPaciente: this.pacienteId
    };
    this.connection = this.auth.getDataDay(_info).subscribe((result: any) => {
      console.log(result, 'agenda from api in day');
      if (result['result']) {
        this.setData(result['result']['data_agenda']);
      }
      this.loading.dismiss();
    }, (err) => {
     console.log(err, 'errores');
     
      //this.loading.dismiss();
      this.hours = this.hourCopy;

      console.log(err);
    });
    //this.auth.sendNotify({ fecha: date, client: this.pacienteId, pkMedico: _info.pkMedico });
  }

  setData(data: any) {
    this.hours = [];
    if (_.isEmpty(data)) {
      this.hours = null;
    } else {
      const res = _.groupBy(data, (v) => {
        return [v.hora]
      });
      _.map(res, (v) => {
        let newData: any =  _.first(v);;
        newData.state = 'Disponible';
        if(v.length > 1) {
          _.forEach(v, (d) => {
            console.log(this.pacienteId, d.pkpaciente,'======');     
            if(d.pkpaciente === this.pacienteId) {
              newData.disabled = true;
              newData.ocupado = false;
              return false;
            } else {
              newData.ocupado = true;
            }
          });
        } 
        this.hours.push(newData);
        console.log(newData,'data newData');
        
      });
      console.log(res, 'datos agrupados');
    }
  }

  getMeeting(hour) {
    console.log(hour, ' hora de la hora ');
    //this.presentModal();
    const _month = this.currentMonth + 1;
    const m = (_month < 10) ? ('0' + _month) : _month;
    const d = (this.day < 10) ? ('0' + this.day) : this.day;
    const date = this.currentYear + '-' + m + '-' + d;
    const _info = {
      fecha: hour.fecha,
      hora: hour.hora,
      medic: this.medic,
      centroMedico: hour.centroMedico.nombre,
      pkCentroMed: hour.centroMedico.id
    }
    console.log(_info, 'INFO PARA AGENDAR CITA');
    this.dataForModal = _info;
    console.log(this.dataForModal, 'Info para el modal agendar cita');
    this.presentModal();
    //let modal = this.mdlCtrl.create(GetMeetingPage, { hour: _info });
    
  }

  async presentModal() {
    const modal = await this.mdlCtrl.create({
      component: GetMeetingPage,
      componentProps: {
        hour: this.dataForModal
     }
    });
    return await modal.present();
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }


}
