
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, AlertController, NavParams, IonSlides } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import * as _ from 'lodash';
import { SearchFilterPage } from './../search-filter/search-filter.page';
import { Info } from '../../shared/mock/months';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-prescription-detail',
  templateUrl: './prescription-detail.page.html',
  styleUrls: ['./prescription-detail.page.scss'],
})
export class PrescriptionDetailPage implements OnInit {

  @ViewChild('slider', { static: true }) slider: IonSlides;
  currentTab: string = 'step1';
  dni: any;
  prescriptions: any;
  dataUser: any;
  dataMedic: any = [];
  datosMedico: any = {};
  datosPaciente: any = {};
  dataReceta: any = [];
  dataIndicaciones: any = [];
  idForRequest: any;
  listProducts: any = [];
  dataForView: any = [];
  prescription: any;
  prescriptionList: any = [];

  lastDataShowed: any = {};
  currentMonth: any;
  currentYear: any;
  lastDay: any;
  day: any;
  today = new Date();
  dateLabel: string = '';
  months = Info.months;
  monthLabel: string;
  idPaciente: any;
  url: any;
  dataRecetaModal: any;
  dataCompra: any;
  newAppointment: any;
  finishedAppointment: any;

  numbers = [-1, 0, 1, 2];
  firstLoad = true;
  slideOpts = {
    initialSlide: 0
  };

  daysWeek = [
    { label: 'Dom.', selected: false, day: '' },
    { label: 'Lun.', selected: true, day: '' },
    { label: 'Mar.', selected: false, day: '' },
    { label: 'Mie.', selected: false, day: '' },
    { label: 'Jue.', selected: false, day: '' },
    { label: 'Vie.', selected: false, day: '' },
    { label: 'Sab.', selected: false, day: '' }];

  constructor(
    //navParams: NavParams,
    private modalCtrl: ModalController,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private router: Router,
    private loadingCtrl: LoadingService,
    private route: ActivatedRoute,
    public mdlCtrl: ModalController,
    private dataService: DataService

  ) {

    this.currentYear = this.today.getFullYear();
    this.monthLabel = Info.months[this.today.getMonth()];
    this.currentMonth = this.today.getMonth();
    this.day = this.today.getDate();
    const index = this.today.getDay();
    this.setWeek(this.day, index);
    const user = JSON.parse(localStorage.getItem('userPaciente'));
    console.log(user, 'userPaciente');
    this.idPaciente = user ? user.id : 1;
    console.log(this.idPaciente, 'id del paciente')
    console.log(this.day, 'dia para presentar');
    this.url = environment.url;
  }

  ngOnInit() {
    //this.slider.slideTo(1, 0, false);
    this.dataUser = JSON.parse(localStorage.getItem('userPaciente'));
    this.dni = this.dataUser.identificacion;
    console.log(this.dni, 'cedula paciente');
    const currentDate = this.getCurrentDate(this.day);
    console.log(currentDate, 'current date');
    this.getAppointment(this.dni);
    //this.getPrescription();
  }

  //CONSULTAR RECETAS POR DIA ESPECIFICO
  getData(currentDate) {
    console.log(currentDate, 'current date');
    this.dataMedic = [];
    this.loadingCtrl.presentLoading();
    this.auth.searchPrescriptionDate(currentDate, this.dni).subscribe(recetas => {
      this.prescriptions = recetas;
      for (let index = 0; index < recetas.length; index++) {
        this.datosMedico = JSON.parse(recetas[index].datosMedico);
        this.datosPaciente = JSON.parse(recetas[index].datosPaciente);
        this.dataIndicaciones = JSON.parse(recetas[index].indicaciones);
        this.dataReceta = JSON.parse(recetas[index].detalles);
        let datos = {
          datosMed: this.datosMedico,
          datosPac: this.datosPaciente,
          detalles: this.dataReceta,
          indicaciones: this.dataIndicaciones,
          fecha: recetas[index].fecha,
          codiRece: recetas[index].codiRece,
        }
        this.dataMedic.push(datos)
      }
      console.log(this.dataMedic, 'RECETAS DEL DIA:', currentDate);
      this.loadingCtrl.dismiss();
    }, (err) => {
      console.log(err, 'error recetas');
      this.loadingCtrl.dismiss();
    });
  }


   //CONSULTAR TODAS LAS RECETAS
  getAppointment(dni) {
    this.loadingCtrl.presentLoading();
    this.auth.getRecetasPaciente(dni).subscribe(recetas => {
      console.log(recetas);
      
      for (let index = 0; index < recetas.length; index++) {
        this.datosMedico = JSON.parse(recetas[index].datosMedico);
        this.datosPaciente = JSON.parse(recetas[index].datosPaciente);
        this.dataIndicaciones = JSON.parse(recetas[index].indicaciones);
        this.dataReceta = JSON.parse(recetas[index].detalles);
        let datos = {
          datosMed: this.datosMedico,
          datosPac: this.datosPaciente,
          detalles: this.dataReceta,
          indicaciones: this.dataIndicaciones,
          fecha: recetas[index].fecha,
          codiRece: recetas[index].codiRece,
          estadoReceta: recetas[index].estadoReceta,
          _id : recetas[index]._id,

        }
        this.dataMedic.push(datos)
      }
      this.newAppointment = _.filter(this.dataMedic, { "estadoReceta": 'nueva' });
      console.log(this.newAppointment, 'nuevas');
      
      this.finishedAppointment = _.filter(this.dataMedic, { "estadoReceta": 'finalizada' });
      console.log(this.finishedAppointment, 'final');
      this.dataMedic = _.orderBy(this.dataMedic, ['fecha'], ['desc']);
      console.log(this.dataMedic, 'LISTA RECETAS');
      this.loadingCtrl.dismiss();
    }, (err) => {
      console.log(err, 'ERROR AL TRAER RECETAS');
      this.loadingCtrl.dismiss();
    });
  }

  goDetails(prescription) {
    this.loadingCtrl.presentLoading();
    this.dataService.dataCompra = prescription;
    this.getProductPrescriptionCompra(this.removeSquareBracket(_.map(prescription.detalles, 'id')));
    this.loadingCtrl.dismiss();
  }
  
  prepareIdsRequest(dataPrescription: any) {
    console.log(dataPrescription, 'DATOS RECETA');
    this.dataRecetaModal = dataPrescription;
    this.idForRequest = this.removeSquareBracket(_.map(dataPrescription.detalles, 'id'));
    this.getProductPrescription(this.removeSquareBracket(_.map(dataPrescription.detalles, 'id')));
    console.log(this.idForRequest, 'ids para request');
  }

  getProductPrescription(ids: string) {
    this.auth.getInfoProducts(ids).subscribe(prescription => {
      this.prescriptionList = prescription;
      console.log(this.prescriptionList, 'PRODUCTOS');
      this.presentModal();
    });
  }

  getProductPrescriptionCompra(ids: string) {
    this.auth.getInfoProducts(ids).subscribe(prescription => {
      this.prescriptionList = prescription;
      this.router.navigate(['prescription'], { state: this.prescriptionList } );
    });
  }

  returnHome() {
    this.router.navigate(['home']);
  }

  changeTab(tab: string) {
    this.currentTab = tab;
    if (tab === 'step1') {
    }
    if (tab === 'step2') {
      console.log(tab, 'tab');
    }
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
  previousWeek() {
    this.prevSlide();
    const currentFirstDay = this.lastDataShowed.firstDay.value;
    if (currentFirstDay === 1 && this.currentMonth === 0) {
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

  getDaysInMonth(month, year) {
    console.log('month yar', month, year);
    this.lastDay = new Date(year, month + 1, 0).getDate();
    return this.lastDay;
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
  }

  setLabel(day, month, year) {
    if (parseInt(day) === this.today.getDate() && year === this.today.getFullYear() && month === this.today.getMonth()) {
      this.dateLabel = 'Hoy'
    } else {
      this.dateLabel = day + ' - ' + this.months[month] + ' - ' + year;
    }
  }

  getCurrentDate(day) {
    const month = this.currentMonth + 1;
    const m = (month < 10) ? ('0' + month) : month;
    const d = (day < 10) ? ('0' + day) : day;
    const date = this.currentYear + '-' + m + '-' + d;
    return date;
  }

  removeSquareBracket(array: []) {
    let resultRemove = '';
    array.map(function (elememnt: any) {
      resultRemove += `${elememnt},`;
    });
    return (resultRemove.slice(0, (resultRemove.length - 1)));
  }

  

  goDetailAppointment(prescription) {
    this.prescription = prescription;
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.mdlCtrl.create({
      component: SearchFilterPage,
      cssClass: 'css-modal',
      componentProps: {
        prescription: this.prescriptionList,
        dataReceta: this.dataRecetaModal
      }
    });
    // modal.onDidDismiss()
    //   .then((data) => {
    //     console.log(data, 'appointment del modal dismiss');

    //   });
    return await modal.present();
  }
}