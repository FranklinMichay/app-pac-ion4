
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})

export class LoadingService {

    isLoading = false;

    constructor(public loadingCtrl: LoadingController, ) { }

    async presentLoading() {
        this.isLoading = true;
        return await this.loadingCtrl.create({
            message: 'cargando datos',
            spinner: 'circles'
        }).then(a => {
            a.present().then(() => {
                console.log('presented');
                if (!this.isLoading) {
                    a.dismiss().then(() => console.log('abort presenting'));
                }
            });
        });
    }

    async dismiss() {
        this.isLoading = false;
        return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
    }

    async loadingPresent() {
        this.isLoading = true;
        return await this.loadingCtrl.create({
            message: 'Please wait ...',
            spinner: 'circles'
        }).then(a => {
            a.present().then(() => {
                console.log('loading presented');
                if (!this.isLoading) {
                    a.dismiss().then(() => console.log('abort laoding'));
                }
            });
        });
    }

    async loadingDismiss() {
        this.isLoading = false;
        return await this.loadingCtrl.dismiss().then(() => console.log('loading dismissed'));
    }


}