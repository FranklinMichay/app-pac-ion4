import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SearchMedicPage } from './search-medic.page';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { TagInputModule } from 'ngx-chips';
import { FilterPipe } from '../../app/pipes/filter.pipe';



const routes: Routes = [
  {
    path: '',
    component: SearchMedicPage
  }
];

@NgModule({
  imports: [
    TagInputModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AutoCompleteModule,

  ],
  declarations: [SearchMedicPage,
    FilterPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA]
})
export class SearchMedicPageModule { }
