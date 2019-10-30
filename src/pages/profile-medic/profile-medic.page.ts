import { LoadingService } from './../../app/services/loading.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HomePage } from '../home/home.page';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-profile-medic',
  templateUrl: './profile-medic.page.html',
  styleUrls: ['./profile-medic.page.scss'],
})
export class ProfileMedicPage implements OnInit {

  medic: any = { };
  slides: any = [
    {
      src: 'https://static.dentalhuelin.com/media/images/instalaciones/6.jpg',
      medicalCenter: 'CLÍNICA SAN JOSÉ', detalle: 'Expertos al cuidado de su salud'
    },
    {
      
      src: 'https://odontoquito.com/wp-content/uploads/2019/03/DSC06027reduc.jpg',
      medicalCenter: 'CLÍNICA SAN JOSÉ', detalle: 'Expertos al cuidado de su salud'
    },
    {
      src: 'http://mundoodontologo.com/wp-content/uploads/2014/10/sillones.png',
      medicalCenter: 'CLÍNICA SAN JOSÉ', detalle: 'Expertos al cuidado de su salud'
    }];

  constructor(
    public navCtrl: NavController, 
    private router: Router,
    private activeRoute: ActivatedRoute,
    private dataService: DataService
  ) { 
    // this.medic = this.router.getCurrentNavigation().extras.state;
    // console.log(this.medic, 'active params');
  }

  ngOnInit() {
    this.medic = this.dataService.dataMedic
    console.log(this.medic, 'datos de medico con dataService');
  }

  goToSchedule() {
    console.log(this.medic, 'DATOS DEL MEDICO SELECCIONADO PARA AGENDA');
    const idMedico = this.medic.id
    this.router.navigate(['schedule', idMedico] );
  }
  
  returnHome() {
    this.router.navigate(['home']);
  }

}
