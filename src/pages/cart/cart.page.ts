import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  dataForView: any;
  iva = 0.12;
  compraTotal: any;
  total: any;
  totalFinal: any;
  total1: any;
  totalFinal1: any;

  constructor(
    private dataService: DataService,
    private router: Router,

  ) {
    //debugger
    if (this.dataService.cart.length > 0) {
      console.log(this.dataService.cart.length, 'longitud d');
      
      console.log('data service');
      
      this.dataForView = this.dataService.cart;
      this.dataForView = _.filter(this.dataForView, item => item.totalDispatch > 0);
      console.log(this.dataForView, 'data carrito');
    } else {
      this.dataForView = this.router.getCurrentNavigation().extras.state;
      console.log(this.dataForView, 'data para compra total');
    }
  }

  ngOnInit() {
    this.total = this.dataForView.reduce((
      acc,
      obj,
    ) => acc + (obj.totalDispatch * obj.price),
      0);
    this.totalFinal = this.calculateTotalDispatch();
  }

  ionViewDidLeave() {
    this.dataForView = []
    this.dataService.cart = []
    console.log(this.dataForView, this.dataService.cart, 'ESTADO DE DATA FOR VIEW & data service');

  }


  calculateTotalDispatch() {
    const sub = this.total * this.iva;
    const result = parseFloat(this.total) + sub;
    return result.toFixed(2);
  }

  goToHome() {
    this.router.navigate(['home']);
  }


}
