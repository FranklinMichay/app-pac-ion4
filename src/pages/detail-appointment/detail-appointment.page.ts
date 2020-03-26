import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { LoadingService } from "src/app/services/loading.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DataService } from "src/app/services/data.service";
import * as _ from "lodash";
import { NavParams } from "@ionic/angular";

@Component({
  selector: "app-detail-appointment",
  templateUrl: "./detail-appointment.page.html",
  styleUrls: ["./detail-appointment.page.scss"]
})
export class DetailAppointmentPage implements OnInit {
  medic: any;
  specilities: any;
  medicalCenter: any;
  medicsByCity: any;
  medicalC: any;
  prescription: any;
  idForRequest: any;
  dataForView: any;
  dataReceta: any;
  dataDespacho: any;
  productoDespacho: any;
  prescriptionList: any = [];
  currentTab: string = "step1";
  estado: string = "nuevo";
  connection: any;

  constructor(
    //navParams: NavParams,
    private auth: AuthService,
    private loadingCtrl: LoadingService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {
    this.productoDespacho = this.router.getCurrentNavigation().extras.state;
    console.log(this.productoDespacho, "PRODUCTOS ");
    this.dataDespacho = this.dataService.dataDespacho;
    console.log(this.dataDespacho, "DESPACHO");
  }

  ngOnInit() {
    this.estado = this.dataDespacho.estadoDespacho;
    console.log(this.estado, "estado");
    this.initSocket();
  }

  changeTab(tab: string) {
    this.currentTab = tab;
    if (tab === "step1") {
      console.log(tab, "tab");
    }
    if (tab === "step3") {
      console.log(tab, "tab");
    }
  }

  goDetails(prescription) {
    this.loadingCtrl.presentLoading();
    this.dataService.dataCompra = prescription;
    this.getProductPrescriptionCompra(
      this.removeSquareBracket(_.map(prescription.detalles, "id"))
    );
    this.loadingCtrl.dismiss();
  }

  getProductPrescriptionCompra(ids: string) {
    this.loadingCtrl.presentLoading();
    this.auth.getInfoProducts(ids).subscribe(prescription => {
      this.prescriptionList = prescription;
      this.router.navigate(["prescription"], { state: this.prescriptionList });
    });
    this.loadingCtrl.dismiss();
  }

  removeSquareBracket(array: []) {
    let resultRemove = "";
    array.map(function(elememnt: any) {
      resultRemove += `${elememnt},`;
    });
    return resultRemove.slice(0, resultRemove.length - 1);
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

  changeCss(estado) {
    let color: string;
    switch (estado) {
      case "camino":
        color = "primary";
        break;
      case "entregado":
        color = "btn-circle";
    }
    return color;
  }

  clickear(es) {
    this.estado = es;
    console.log(this.estado, "estadoooo");
  }

  initSocket() {
    if (this.connection !== undefined) {
      this.connection.unsubscribe();
      this.auth.removeListener("dispatch");
    }
    this.connection = this.auth.getDataDispatch().subscribe(
      (result: any) => {
        console.log(result, "socket....");
        this.processData(result);
      },
      error => {
        console.log(error, 'error socket');
      }
    );
  }

  processData(result: any) {
    this.dataDespacho = result;
    console.log(this.dataDespacho, "DESPACHO ACTUALIZADO");
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
