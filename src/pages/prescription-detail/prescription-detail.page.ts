import { ToastService } from "./../../app/services/toast.service";
import { log } from "util";
import { formatDate } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  ModalController,
  AlertController,
  NavParams,
  IonSlides,
} from "@ionic/angular";
import { AuthService } from "src/app/services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { LoadingService } from "src/app/services/loading.service";
import * as _ from "lodash";
import { SearchFilterPage } from "./../search-filter/search-filter.page";
import { Info } from "../../shared/mock/months";
import { environment } from "src/environments/environment";
import { DataService } from "src/app/services/data.service";
import { ToastController } from "@ionic/angular";
// import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: "app-prescription-detail",
  templateUrl: "./prescription-detail.page.html",
  styleUrls: ["./prescription-detail.page.scss"],
})
export class PrescriptionDetailPage implements OnInit {
  @ViewChild("slider", { static: true }) slider: IonSlides;
  currentTab: string = "step1";
  currentStep = false;
  dni: any;
  prescriptions: any;
  dataUser: any;
  dataMedic: any = [];
  datosMedico: any = {};
  datosPaciente: any = {};
  dataReceta: any = [];
  dataIndicaciones: any = [];
  idForRequest: any;
  idDespForRequest: any;
  listProducts: any = [];
  dataForView: any = [];
  prescription: any;
  prescriptionList: any = [];
  productDesp: any;
  despachos: any = {};
  despachosTotal: any = {};
  lastDataShowed: any = {};
  currentMonth: any;
  currentYear: any;
  lastDay: any;
  day: any;
  today = new Date();
  dateLabel: string = "";
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
    initialSlide: 0,
  };

  dateDivider: any;
  sliceInfo: any;

  //EJEMPLO DIVIDER
  list1: any[];
  list2: any[];
  dia;

  daysWeek = [
    { label: "Dom.", selected: false, day: "" },
    { label: "Lun.", selected: true, day: "" },
    { label: "Mar.", selected: false, day: "" },
    { label: "Mie.", selected: false, day: "" },
    { label: "Jue.", selected: false, day: "" },
    { label: "Vie.", selected: false, day: "" },
    { label: "Sab.", selected: false, day: "" },
  ];

  //SOCKET DESPACHOS
  connection: any;
  notify: boolean = false;

  //VARIABLES LISTAR RECETAS
  detailProd: any = [];
  data: any;

  constructor(
    //navParams: NavParams,
    private modalCtrl: ModalController,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private router: Router,
    private loadingCtrl: LoadingService,
    private route: ActivatedRoute,
    public mdlCtrl: ModalController,
    private dataService: DataService,
    public toastController: ToastController,
    public toast: ToastService
  ) {
    this.currentYear = this.today.getFullYear();
    this.monthLabel = Info.months[this.today.getMonth()];
    this.currentMonth = this.today.getMonth();
    this.day = this.today.getDate();
    const index = this.today.getDay();
    this.setWeek(this.day, index);
    const user = JSON.parse(localStorage.getItem("userPaciente"));
    this.idPaciente = user ? user.id : 1;
    this.dni = user.identificacion;
    this.url = environment.url;
    //this.slider.slideTo(1, 0, false);
    const currentDate = this.getCurrentDate(this.day);
    // console.log(currentDate, 'current date');
  }

  ngOnInit() {
    this.getAppointment(this.dni);
    this.getDespById();
    this.initSocket();
    this.notify = JSON.parse(localStorage.getItem("compradas"));
    // this.nofi();

    //console.log(formatDate(new Date(), "yyyy-MM-dd HH:MM", "en-US"), 'daten');
  }

  ionViewDidEnter() {
    this.notify = JSON.parse(localStorage.getItem("compradas"));
  }

  // ionViewDidEnter() {
  //   console.log('ionViewDidEnter');
  //   this.getAppointment(this.dni);
  // }

  //CONSULTAR RECETAS POR DIA ESPECIFICO
  getData(currentDate) {
    console.log(currentDate, "current date");
    this.dataMedic = [];
    this.loadingCtrl.presentLoading();
    this.auth.searchPrescriptionDate(currentDate, this.dni).subscribe(
      (recetas) => {
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
          };
          this.dataMedic.push(datos);
        }
        console.log(
          this.dataMedic,
          "RECETAS POR UN  DIA ESPECIFICO",
          currentDate
        );
        this.loadingCtrl.dismiss();
      },
      (err) => {
        console.log(err, "error recetas");
        this.loadingCtrl.dismiss();
      }
    );
  }

  set(arr) {
    return arr.reduce(function (a, val) {
      if (a.indexOf(val) === -1) {
        let sli = val.slice(0, 10);
        a.push(sli);
      }
      return a;
    }, []);
  }

  //CONSULTAR TODAS LAS RECETAS
  getAppointment(dni) {
    this.loadingCtrl.presentLoading();
    this.auth.getRecetasPaciente(dni).subscribe(
      (recetas) => {
        console.log(recetas, "desde el  server");
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
            _id: recetas[index]._id,
            hora: recetas[index].hora,
            indicacionesAdicionales: recetas[index].indicacionesAdicionales,
          };
          this.dataMedic.push(datos);
        }
        console.log(this.dataMedic, "TODAS LAS RECETAS");
        this.newAppointment = _.filter(this.dataMedic, {
          estadoReceta: "nueva",
        });
        this.newAppointment = _.orderBy(
          this.newAppointment,
          ["fecha"],
          ["desc"]
        );
        console.log(
          this.newAppointment,
          "RECETAS NUEVAS ORDENADAS DESCENDENTEMENTE"
        );
        this.finishedAppointment = _.filter(this.dataMedic, {
          estadoReceta: "finalizada",
        });
        this.finishedAppointment = _.orderBy(
          this.finishedAppointment,
          ["fecha"],
          ["desc"]
        );
        console.log(
          this.finishedAppointment,
          "RECETAS COMPRADAS ORDENADAS DESCENDENTEMENTE"
        );
        this.loadingCtrl.dismiss();
      },
      (err) => {
        console.log(err, "ERROR RECETAS");
        this.toast.presentToastError(
          "Error de conexión, por favor intente luego"
        );
        this.loadingCtrl.dismiss();
      }
    );
  }

  //MOSTRAR DETALLES DE RECETAS
  goDetailsAppointment(appointment) {
    this.detailProd = appointment;
    if (appointment.detalles.length === 0) {
      this.router.navigate(["detail-appointment"], {
        state: this.detailProd,
      });
    } else {
      this.idForRequest = this.removeSquareBracket(
        _.map(appointment.detalles, "id")
      );
      this.getDataDetailProduct(
        this.removeSquareBracket(_.map(appointment.detalles, "id"))
      );
      console.log(this.idForRequest, "ids para request");
    }
    
  }

  getDataDetailProduct(ids: string) {
    this.auth.getInfoProducts(ids).subscribe(
      (productsAppointment) => {
        console.log(productsAppointment, 'getDataDetailProduct');
        this.dataService.dataAppointment = productsAppointment;     
        this.router.navigate(["detail-appointment"], {
          state: this.detailProd,
        });
      },
      (err) => {
        console.log(err, "error");
      }
    );
  }

  processDataInfoProducts() {
    this.dataForView = [];
    console.log("DETALLES DE PRODUCTOS =====>", this.detailProd);

    this.data = {};
    let i = 0;
    for (const elemnt of this.detailProd) {
      this.data.index = i;
      this.data._id = elemnt._id;
      this.data.product = this.detailProd[i].idProducto.nombre;
      this.data.pharmacyForm = this.detailProd[i].idProducto.formaFarmaceutica;
      this.data.concentration = this.detailProd[i].idProducto.concentracion;
      this.data.presentation = this.detailProd[i].idProducto.presentacion;
      this.dataForView.push(this.data);
      this.data = {};
      i++;
    }
    console.log(this.dataForView, "DATA DESPACHO PROCESADO");
  }

  goDetails(prescription) {
    this.dataService.dataCompra = prescription;
    this.getProductPrescriptionCompra(
      this.removeSquareBracket(_.map(prescription.detalles, "id"))
    );
  }

  prepareIdsRequest(dataPrescription: any) {
    console.log(dataPrescription, "DATOS RECETA");
    this.dataRecetaModal = dataPrescription;
    this.dataService.dataReceta = dataPrescription;
    if (dataPrescription.detalles.length === 0) {
      this.presentToastCompra("LA RECETA NO TIENE PRODUCTOS");
    } else {
      this.idForRequest = this.removeSquareBracket(
        _.map(dataPrescription.detalles, "id")
      );
      this.getProductPrescription(
        this.removeSquareBracket(_.map(dataPrescription.detalles, "id"))
      );
      console.log(this.idForRequest, "ids para request");
    }
  }

  getProductPrescription(ids: string) {
    this.auth.getInfoProducts(ids).subscribe(
      (prescription) => {
        this.prescriptionList = prescription;
        console.log(this.prescriptionList, "PRODUCTOS");
        this.router.navigate(["prescription"], {
          state: this.prescriptionList,
        });
      },
      (err) => {
        console.log(err, "error");
      }
    );
  }

  goDetailDesp() {
    this.router.navigate(["detail-appointment"], {
      state: this.prescriptionList,
    });
  }

  getProductPrescriptionCompra(ids: string) {
    this.auth.getInfoProducts(ids).subscribe(
      (prescription) => {
        this.prescriptionList = prescription;
        this.router.navigate(["prescription"], {
          state: this.prescriptionList,
        });
      },
      (err) => {
        console.log(err, "error");
      }
    );
  }

  returnHome() {
    this.router.navigate(["home"]);
  }

  changeTab(tab: string) {
    this.currentTab = tab;
    if (tab === "step1") {
      this.currentStep = false;
      console.log(tab, "tab");
    }

    if (tab === "step2") {
      this.currentStep = true;
      this.notify = false;
      localStorage.setItem("compradas", JSON.stringify(false));
      localStorage.setItem("appointmentHome", JSON.stringify(false));
      console.log(tab, "tab");
    }

    if (tab === "step3") {
      this.currentStep = true;
      console.log(tab, "tab");
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
      console.log(newIndex, "active index next");
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
      console.log(newIndex, "active index prev");
      newIndex++;
      this.numbers.unshift(this.numbers[0] - 1);
      console.log(this.numbers.unshift(this.numbers[0] - 1), "unshift");
      this.numbers.pop();
      this.slider.slideTo(newIndex, 0, false);
      console.log(`New status: ${this.numbers}`);
    });
  }
  previousWeek() {
    this.prevSlide();
    const currentFirstDay = this.lastDataShowed.firstDay.value;
    if (currentFirstDay === 1 && this.currentMonth === 0) {
      this.currentYear = this.currentYear - 1;
      this.currentMonth = 12;
    }
    this.currentMonth =
      currentFirstDay === 1 ? this.currentMonth - 1 : this.currentMonth;
    const newDay =
      currentFirstDay === 1
        ? this.getDaysInMonth(this.currentMonth, this.currentYear)
        : currentFirstDay - 1;
    const newIndex =
      this.lastDataShowed.firstDay.index === 0
        ? 6
        : this.lastDataShowed.firstDay.index - 1;
    this.setWeek(newDay, newIndex);
    this.changeDay(
      this.daysWeek[3].day || this.daysWeek[0].day || this.daysWeek[6].day
    );
  }

  nextWeek() {
    this.nextSlide();
    const currentLastDay = this.lastDataShowed.lastDay.value;
    if (currentLastDay === this.lastDay && this.currentMonth === 11) {
      this.currentYear = this.currentYear + 1;
    }
    this.currentMonth =
      currentLastDay === this.lastDay
        ? (this.currentMonth + 1) % 12
        : this.currentMonth;
    const newDay = this.lastDay === currentLastDay ? 1 : currentLastDay + 1;
    const newIndex =
      this.lastDataShowed.lastDay.index === 6
        ? 0
        : this.lastDataShowed.lastDay.index + 1;
    this.setWeek(newDay, newIndex);
    this.changeDay(
      this.daysWeek[3].day || this.daysWeek[0].day || this.daysWeek[6].day
    );
  }

  getDaysInMonth(month, year) {
    console.log("month yar", month, year);
    this.lastDay = new Date(year, month + 1, 0).getDate();
    return this.lastDay;
  }

  setWeek(day, index) {
    console.log(
      day,
      "dia",
      index,
      "index",
      this.currentMonth,
      this.currentYear,
      "data showed"
    );
    let dayAux = day;
    let dayAux1 = day;
    let i = index;
    let j = index;
    this.getDaysInMonth(this.currentMonth, this.currentYear);
    this.daysWeek = _.map(this.daysWeek, (v, i) => {
      v.selected = i === index ? true : false;
      return v;
    });
    for (; i < 7; i++) {
      console.log("this. last day", this.lastDay);
      if (dayAux <= this.lastDay) {
        this.daysWeek[i].day = dayAux;
        this.lastDataShowed.lastDay = {
          index: i,
          value: dayAux,
        };
        dayAux += 1;
      } else {
        this.daysWeek[i].day = "";
      }
    }
    for (; j >= 0; j--) {
      if (day === 1) {
        this.daysWeek[j].day = "";
        this.daysWeek[index].day = day;
        this.lastDataShowed.firstDay = {
          index: index,
          value: day,
        };
      } else if (dayAux1 >= 1) {
        this.daysWeek[j].day = dayAux1;
        this.lastDataShowed.firstDay = {
          index: j,
          value: dayAux1,
        };
        dayAux1 -= 1;
      } else {
        this.daysWeek[j].day = "";
      }
    }
  }

  changeDay(day) {
    console.log("cambio el dia");
    this.setLabel(day, this.currentMonth, this.currentYear);
    this.getDaysInMonth(this.currentMonth, this.currentYear);
    const currentDate = this.getCurrentDate(day);
    this.getData(currentDate);
    this.daysWeek = _.map(this.daysWeek, (v, i) => {
      v.selected = day === v.day ? true : false;
      return v;
    });
    this.day = day;
  }

  setLabel(day, month, year) {
    if (
      parseInt(day) === this.today.getDate() &&
      year === this.today.getFullYear() &&
      month === this.today.getMonth()
    ) {
      this.dateLabel = "Hoy";
    } else {
      this.dateLabel = day + " - " + this.months[month] + " - " + year;
    }
  }

  getCurrentDate(day) {
    const month = this.currentMonth + 1;
    const m = month < 10 ? "0" + month : month;
    const d = day < 10 ? "0" + day : day;
    const date = this.currentYear + "-" + m + "-" + d;
    return date;
  }

  removeSquareBracket(array: []) {
    let resultRemove = "";
    array.map(function (elememnt: any) {
      resultRemove += `${elememnt},`;
    });
    return resultRemove.slice(0, resultRemove.length - 1);
  }

  prepareIdsRequest1(dataPrescription: any) {
    console.log(dataPrescription, "DATOS RECETA");
    this.dataRecetaModal = dataPrescription;
    this.dataService.dataReceta = dataPrescription;
    this.idForRequest = this.removeSquareBracket(
      _.map(dataPrescription.detalles, "id")
    );
    this.getProductPrescription1(
      this.removeSquareBracket(_.map(dataPrescription.detalles, "id"))
    );
    console.log(this.idForRequest, "ids para request");
  }

  getProductPrescription1(ids: string) {
    this.auth.getInfoProducts(ids).subscribe(
      (prescription) => {
        this.prescriptionList = prescription;
        console.log(this.prescriptionList, "PRODUCTOS");
        this.router.navigate(["detail-appointment"], {
          state: this.prescriptionList,
        });
      },

      (err) => {
        console.log(err, "error");
      }
    );
  }

  goDetailAppointment(prescription) {
    this.prescription = prescription;
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.mdlCtrl.create({
      component: SearchFilterPage,
      cssClass: "css-modal",
      componentProps: {
        prescription: this.prescriptionList,
        dataReceta: this.dataRecetaModal,
      },
    });
    // modal.onDidDismiss()
    //   .then((data) => {
    //     console.log(data, 'appointment del modal dismiss');

    //   });
    return await modal.present();
  }

  //METODOS DESPACHO
  getDespById() {
    this.auth.getDespById(this.dni).subscribe(
      (despacho: any) => {
        this.despachosTotal = despacho;
        console.log(despacho, "DESPACHO PURO");
        this.despachos = despacho;

        this.despachos.map((element: any) => {
          element.detalles = JSON.parse(element.detalles);
          element.datosReceta.datosMedico = JSON.parse(
            element.datosReceta.datosMedico
          );
          element.datosReceta.datosPaciente = JSON.parse(
            element.datosReceta.datosPaciente
          );
          element.datosReceta.detalles = JSON.parse(
            element.datosReceta.detalles
          );
          element.datosReceta.indicaciones = JSON.parse(
            element.datosReceta.indicaciones
          );
        });

        this.dateDivider = this.returnDate(despacho);
        this.despachos = _.orderBy(this.despachos, ["fecha"], ["desc"]);
        console.log(this.dateDivider, "date divider");
        console.log(this.despachos, "lista de despachos descendente");
      },

      (err) => {
        console.log(err, "error");
      }
    );
  }

  returnDate(data: any) {
    const arrDate = [];
    data.map((obj: any) => {
      arrDate.push(obj.fecha.slice(0, 10));
    });
    arrDate.reverse();
    return _.uniq(arrDate);
  }

  sliceDataDate(data: any) {
    /*data.map((elemnt:any) => {
      elemnt.fecha = elemnt.fecha.slice(0,10);
    });*/

    this.dateDivider = this.removeSquareBracket(_.map(data, "fecha"));
    console.log(this.dateDivider, "fechas despachos string");

    this.dateDivider = this.set(this.dateDivider.split(","));
    console.log(this.dateDivider, "fechas listar despachos");
  }

  prepareIdsDesp(desp: any) {
    this.dataService.dataDespacho = desp;
    console.log(this.dataService.dataDespacho, "despacho select");
    this.idDespForRequest = this.removeSquareBracket(
      _.map(desp.detalles, "id")
    );
    console.log(this.idDespForRequest, "IDS DE DESPACHOS");
    this.getProductDesp(this.removeSquareBracket(_.map(desp.detalles, "id")));
  }

  getProductDesp(ids: string) {
    // this.loadingCtrl.presentLoading();
    this.auth.getInfoProducts(ids).subscribe((product) => {
      this.productDesp = product;
      console.log(this.productDesp, "PRODUCTOS DE DESPACHO");
      this.router.navigate(["detail-appointment"], { state: this.productDesp });
      // this.loadingCtrl.dismiss();
    });
  }

  getColor(estado) {
    let color: string;
    switch (estado) {
      case "nuevo":
        color = "primary";
        break;
      case "camino":
        color = "warning";
        break;
      case "entregado":
        color = "success";
        break;
      case "cancelado":
        color = "danger";
        break;
      case "preparado":
        color = "danger";
        break;
      case "preparadoTrans":
        color = "danger";
        break;
      default:
        color = "dark";
    }
    return color;
  }

  async presentToastCompra(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: "dark",
    });
    toast.present();
  }

  //SOCKET DESPACHOS
  initSocket() {
    if (this.connection !== undefined) {
      this.connection.unsubscribe();
      this.auth.removeListener("dispatch");
    }
    this.connection = this.auth.getDataDispatch().subscribe((result: any) => {
      console.log(result, "DATA SOCKET DESPACHO NUEVO");
      this.processData(result);
    });
  }

  processData(result: any) {
    if (result.estadoDespacho === "nuevo") {
      // this.getAppointment(this.dni);
      this.getDespById();
      //const despachos = this.db.doc('despachos/s8SoZa88D6eavUD3UQmA').update(result);
      // despachos.subscribe(data => {
      //   console.log(data);
      // });
      //this.despachos.push(result);
    }
    const index = this.findIndexDispatch(result._id);
    this.despachos[index] = result;
    this.despachos[index].detalles = JSON.parse(this.despachos[index].detalles);
    this.despachos[index].datosReceta.datosMedico = JSON.parse(
      this.despachos[index].datosReceta.datosMedico
    );
    this.despachos[index].datosReceta.datosPaciente = JSON.parse(
      this.despachos[index].datosReceta.datosPaciente
    );
    this.despachos[index].datosReceta.detalles = JSON.parse(
      this.despachos[index].datosReceta.detalles
    );
    this.despachos[index].datosReceta.indicaciones = JSON.parse(
      this.despachos[index].datosReceta.indicaciones
    );

    this.despachos = _.orderBy(this.despachos, ["fecha"], ["desc"]);
    console.log(this.despachos, "DESPACHOS ACTUALIZADOS");
  }

  findIndexDispatch(id: any) {
    return this.despachos.findIndex((obj) => obj._id === id);
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
