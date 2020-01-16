import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class DataService {

  dataMedic = {}
  dataDelete = {}
  tagsParam = [];
  idAcceptPosponed = {};
  dataCancelPosponed = {};

  dataCompra= [];
  constructor(

  ) { }


  ngOnInit() {
    if (this.dataMedic) {
      console.log(this.dataMedic, 'data medic');
    }
  }

  param() {
    console.log(
      this.tagsParam, 'los params');
  }



}