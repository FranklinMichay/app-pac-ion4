import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, NavParams } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-prescription-detail',
  templateUrl: './prescription-detail.page.html',
  styleUrls: ['./prescription-detail.page.scss'],
})
export class PrescriptionDetailPage implements OnInit {

  dataReceta: any;
  constructor(
    //navParams: NavParams,
    private modalCtrl: ModalController,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private router: Router,
    private loadingCtrl: LoadingService,
    private route: ActivatedRoute,
  ) { 
    //this.dataReceta = navParams.get('receta');
    this.dataReceta = this.router.getCurrentNavigation().extras.state;
    console.log(this.dataReceta,'recetaaa');
    
  }

  ngOnInit() {
    console.log(this.dataReceta, 'data receta');
  }

  returnHome() {
    this.router.navigate(['home']);
  }

}
