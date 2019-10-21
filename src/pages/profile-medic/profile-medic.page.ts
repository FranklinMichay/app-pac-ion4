import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HomePage } from '../home/home.page';
import { Router, ActivatedRoute } from '@angular/router';

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
    private activeRoute: ActivatedRoute
  ) { 
    this.medic = this.router.getCurrentNavigation().extras.state;
    console.log(this.medic, 'active params');
  }

  ngOnInit() {

  }

  goToSchedule() {
    console.log(this.medic, 'DATOS DEL MEDICO SELECCIONADO PARA AGENDA');
    this.router.navigate(['schedule'], { state: this.medic} );
  }
  
  returnHome() {
    this.router.navigate(['home']);
  }

}
