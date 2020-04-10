import { log } from "util";
import { formatDate } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  LoadingController,
  ToastController,
  Platform,
  MenuController,
  NavController,
  AlertController,
} from "@ionic/angular";
import { Info } from "../../shared/mock/months";
import { AuthService } from "../../../src/app/services/auth.service";
import { BackgroundMode } from "@ionic-native/background-mode/ngx";
import { Router } from "@angular/router";
import * as _ from "lodash";
import { DomSanitizer } from "@angular/platform-browser";
import { Socket } from "ngx-socket-io";
import { fn } from "@angular/compiler/src/output/output_ast";
import {
  LocalNotifications,
  ILocalNotificationActionType,
} from "@ionic-native/local-notifications/ngx";
import { Subscription } from "rxjs";
import { environment } from "src/environments/environment";
import { ActivatedRoute } from "@angular/router";
import { NetworkService } from "src/app/services/network-service.service";
import { ToastService } from "src/app/services/toast.service";
import { LoadingService } from "src/app/services/loading.service";
import { AndroidFullScreen } from "@ionic-native/android-full-screen/ngx";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  isConnected = false;
  url: any;
  data: any;
  alert = false;
  dataUser: any;
  slides: any = [
    {
      src: "assets/imgs/slide2.jpg",
      medicalCenter: "CLÍNICA MEDIPHARM",
      detalle:
        "Expertos al cuidado de su salud Expertos al cuidado de su salud",
    },
    {
      src: "assets/imgs/slide6.jpg",
      medicalCenter: "FARMACIA SAN DANIEL",
      detalle:
        "Expertos al cuidado de su salud Expertos al cuidado de su salud",
    },
    {
      src: "assets/imgs/slide3.jpg",
      medicalCenter: "LABORATORIO CLINICO LOJA",
      detalle:
        "Expertos al cuidado de su salud Expertos al cuidado de su salud",
    },
  ];
  connection: any;
  connectionDispatch: any;
  dataHome: any;
  dataHomeDelete: any;
  imageUrl: any;
  clickSub: any;
  subscription: any;
  slideOptsOne = {
    // initialSlide: 0,
    // slidesPerView: 1,
    autoplay: true,
  };
  cita: any;
  worker: Subscription;
  backButtonSubscription;
  hora: any;
  fecha: any;
  price: any = "";
  v1: any;
  v2: any;
  idUser: any;
  tokenNotify: any;
  notify: boolean = false;
  notifyAppointment: boolean = true;
  stateNotify: any;

  constructor(
    public navCtrl: NavController,
    public toast: ToastController,
    private auth: AuthService,
    public platform: Platform,
    public router: Router,
    private sanitizer: DomSanitizer,
    private backgroundMode: BackgroundMode,
    private localNotifications: LocalNotifications,
    public menuControler: MenuController,
    public alertController: AlertController,
    private route: ActivatedRoute,
    public plt: Platform,
    private networkService: NetworkService,
    private toastService: ToastService,
    private loadingCtrl: LoadingService,
    private androidFullScreen: AndroidFullScreen
  ) {
    this.price = this.route.snapshot.params["price"];
    this.data = Info.categories;
  }

  ngOnInit() {
    this.initSocket();
    this.initSocketAppointment();
    this.onClickAlert();
    this.data = Info.categories;
    this.dataUser = JSON.parse(localStorage.getItem("userPaciente"));
    this.idUser = this.dataUser ? this.dataUser.id : null;

    this.imageUrl = this.dataUser.fotoPerfil;
    this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.imageUrl
    );

    this.url = environment.url;

    let now = new Date();
    this.fecha = formatDate(now, "yyyy-MM-dd", "en-US");
    var hora = ("0" + new Date().getHours()).substr(-2);
    var min = ("0" + new Date().getMinutes()).substr(-2);
    var seg = ("0" + new Date().getSeconds()).substr(-2);
    this.hora = hora + ":" + min + ":" + seg;
    console.log(this.fecha, this.hora, "hora y fecha");
    this.getDataPac();

    this.notify = JSON.parse(localStorage.getItem("meetingHome"));
    this.notifyAppointment = JSON.parse(
      localStorage.getItem("appointmentHome")
    );
  }

  //SOCKET CITAS
  initSocketAppointment() {
    if (this.connection !== undefined) {
      this.connection.unsubscribe();
      this.auth.removeListener("calendar");
    }

    this.connection = this.auth.getDataAlerts().subscribe(
      (cita: any) => {
        this.cita = cita;
        this.notify = true;
        console.log("notify true");

        localStorage.setItem("meetingHome", JSON.stringify(true));
        if (this.cita.estadoCita === "postponed") {
          localStorage.setItem("postponed", JSON.stringify(true));
        } else if (this.cita.estadoCita === "canceled") {
          localStorage.setItem("canceled", JSON.stringify(true));
        }

        this.getDataPac();
        this.notification();
      },
      (err) => {
        console.log(err, "error getAlerts");
      }
    );
  }

  //SOCKET DESPACHOS
  initSocket() {
    if (this.connectionDispatch !== undefined) {
      this.connectionDispatch.unsubscribe();
      this.auth.removeListener("dispatch");
    }
    this.connectionDispatch = this.auth
      .getDataDispatch()
      .subscribe((result: any) => {
        localStorage.setItem("appointmentHome", JSON.stringify(true));
        this.notifyAppointment = true;
        if (
          result.estadoDespacho === "nuevo" ||
          result.estadoDespacho === "preparado" ||
          result.estadoDespacho === "preparadoTrans" ||
          result.estadoDespacho === "camino"
        ) {
          localStorage.setItem("compradas", JSON.stringify(true));
        }
        console.log(result, "DATA SOCKET DESPACHO NUEVO");
      });
  }

  onClickAlert() {
    this.clickSub = this.localNotifications.on("click").subscribe((data) => {
      this.presentAlert(
        "Médico:" +
          " " +
          data.data.medico +
          "<br>" +
          "fecha:" +
          " " +
          data.data.fecha +
          "<br>" +
          "hora:" +
          " " +
          data.data.hora +
          "<br>" +
          "motivo:" +
          " " +
          data.data.motivo
      );
    });
  }

  testNetwork() {
    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      if (!this.isConnected) {
        console.log("Por favor enciende tu conexión a Internet");
      }
    });
  }

  ionViewDidEnter() {
    this.dataUser = JSON.parse(localStorage.getItem("userPaciente"));
    this.imageUrl = this.dataUser.fotoPerfil;
    this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.imageUrl
    );
    this.getDataPac();
    this.notify = JSON.parse(localStorage.getItem("meetingHome"));
    this.notifyAppointment = JSON.parse(
      localStorage.getItem("appointmentHome")
    );
  }

  ionViewDidLeave() {}

  notification() {
    if (this.cita.estadoCita === "postponed") {
      this.localNotifications.schedule({
        id: this.cita.paciente.id,
        title: "SU CITA FUE POSPUESTA",
        text:
          "Fecha: " +
          " " +
          this.cita.fecha +
          "\n" +
          "hora:" +
          " " +
          this.cita.hora,
        data: {
          medico:
            this.cita.medico.priNombre + " " + this.cita.medico.priApellido,
          fecha: this.cita.fecha,
          hora: this.cita.hora,
          motivo: "",
        },
        sound: this.platform.is("android")
          ? "file://assets/sound/sound.mp3"
          : "file://assets/sound/sorted.m4r",
        smallIcon: "res://drawable-hdpi/ic_launcher.png",
        icon: "res://drawable-hdpi/ic_launcher.png",
        foreground: true,
      });
    } else if (this.cita.estadoCita === "canceled") {
      this.localNotifications.schedule({
        id: this.cita.paciente.id,
        title: "SU CITA FUE CANCELADA",
        text:
          "Motivo: " +
          " " +
          this.cita.detalleCancelado +
          "\n" +
          "Fecha:" +
          " " +
          this.cita.fecha +
          "\n" +
          "hora:" +
          " " +
          this.cita.hora,
        data: {
          medico:
            this.cita.medico.priNombre + " " + this.cita.medico.priApellido,
          fecha: this.cita.fecha,
          hora: this.cita.hora,
          motivo: this.cita.detalleCancelado,
        },
        sound: this.platform.is("android")
          ? "file://assets/sound/sound.mp3"
          : "file://assets/sound/sorted.m4r",
        smallIcon: "res://drawable-hdpi/ic_launcher.png",
        icon: "res://drawable-hdpi/ic_launcher.png",
        foreground: true,
      });
    }
  }

  async presentAlert(data) {
    const alert = await this.alertController.create({
      header: "Detalles:",
      message: data,
      buttons: [
        {
          text: "OK",
        },
        {
          text: "Ir a mis Citas",
          handler: () => {
            this.router.navigate(["meetings"]);
            console.log("Ir a mis Citas");
          },
        },
      ],
    });
    await alert.present();
  }

  unsub() {
    this.clickSub.unsubscribe();
  }

  getDataPac() {
    //this.loadingCtrl.presentLoading();
    this.auth.getMeetingData(this.idUser).subscribe(
      (cita: any) => {
        var citaFilter = _.filter(cita, (item) => item.fecha >= this.fecha);
        citaFilter = _.orderBy(citaFilter, ["fecha"], ["asc"]);
        console.log(citaFilter, "CITAS PACIENTE ACCEPTED");
        this.dataHomeDelete = _.filter(
          citaFilter,
          (item) => item.hora >= this.hora
        );
        this.dataHome = _.first(this.dataHomeDelete);
        console.log(this.dataHome, "PROXIMA CITA PACIENTE");
        //this.loadingCtrl.dismiss();
      },
      (err) => {
        console.log(err, "error ultima cita");
        //this.loadingCtrl.dismiss();
      }
    );
  }

  removeData(id) {
    _.remove(this.dataHome, function (n) {
      return n.id === id;
    });
  }

  goToMenu(component) {
    let dataNotifyMeet: any;
    console.log(component, "componente");
    if (component === "meetings") {
      this.notify = false;
      localStorage.setItem("meetingHome", JSON.stringify(false));
    } else if (component === "prescription-detail") {
      this.notifyAppointment = false;
      localStorage.setItem("appointmentHome", JSON.stringify(false));
    }

    if (component) {
      this.router.navigateByUrl(component);
    } else {
      this.presentToast();
    }
  }

  async presentToast() {
    let toast = await this.toast.create({
      message: "Componente en Construccion",
      duration: 3000,
    });
    toast.present();
  }

  logout() {
    this.connection.unsubscribe();
    this.auth.removeListener("calendar");
    localStorage.removeItem("userPaciente");
    localStorage.removeItem("notify");
    this.unsub();
    this.router.navigate(["login"]);
  }

  // saveToken(token) {
  //   const data: any = {
  //     token: token,
  //     userid: this.dataUser.identificacion
  //   };
  //   console.log(data, "data para server");
  //   this.auth.saveToken(data).subscribe(
  //     data => {
  //       console.log("data ok=> ", JSON.stringify(data));
  //     },
  //     error => {
  //       console.log("error post =>", JSON.stringify(error));
  //     }
  //   );
  // }

  // OnDestroy() {
  //   this.connection.unsubscribe();
  //   this.auth.removeListener('calendar');

  // }

  // async  loginWithGoogle() {
  //   this.dataGoogle = await this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
  //   console.log('datos google OK', this.dataGoogle);
  // }

  // async  loginWithFacebook() {
  //   this.dataFacebook = await this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider())
  //   console.log('datos facebook OK', this.dataFacebook);
  //   //localStorage.setItem('user', JSON.stringify(this.data));

  // }
}
