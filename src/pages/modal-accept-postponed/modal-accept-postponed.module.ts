import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalAcceptPostponedPage } from './modal-accept-postponed.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAcceptPostponedPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: []
})
export class ModalAcceptPostponedPageModule {}
