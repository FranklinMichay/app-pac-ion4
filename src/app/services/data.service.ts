import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})

export class DataService {
    
    dataMedic = {}
    dataDelete = {}
    constructor( 

    ) { }

    
  ngOnInit() {
    if (this.dataMedic){
        console.log(this.dataMedic, 'data medic');
        
        
    }
  }
}