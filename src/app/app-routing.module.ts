import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule) },
  { path: 'login', loadChildren: () => import('../pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'forgot-password', loadChildren: () => import('../pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule) },
  { path: 'search-medic', loadChildren: () => import('../pages/search-medic/search-medic.module').then(m => m.SearchMedicPageModule) },
  { path: 'profile', loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfilePageModule) },
  { path: 'profile-medic', loadChildren: () => import('../pages/profile-medic/profile-medic.module').then(m => m.ProfileMedicPageModule) },
  { path: 'schedule/:idMedico', loadChildren: () => import('../pages/schedule/schedule.module').then(m => m.SchedulePageModule) },
  { path: 'meetings', loadChildren: () => import('../pages/meetings/meetings.module').then(m => m.MeetingsPageModule) },
  { path: 'register', loadChildren: () => import('../pages/register/register.module').then(m => m.RegisterPageModule) },
  { path: 'get-meeting', loadChildren: () => import('../pages/get-meeting/get-meeting.module').then(m => m.GetMeetingPageModule) },
  { path: 'detail-medic/:state/:posponed', loadChildren: () => import('../pages/detail-medic/detail-medic.module').then(m => m.DetailMedicPageModule) },
  { path: 'modal-cancel', loadChildren: () => import('../pages/modal-cancel/modal-cancel.module').then(m => m.ModalCancelPageModule) },
  { path: 'profile', loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfilePageModule) },
  { path: 'register', loadChildren: () => import('../pages/register/register.module').then(m => m.RegisterPageModule) },
  { path: 'edit-profile', loadChildren: () => import('../pages/edit-profile/edit-profile.module').then(m => m.EditProfilePageModule) },
  { path: 'search-filter', loadChildren: () => import('../pages/search-filter/search-filter.module').then(m => m.SearchFilterPageModule) },
  { path: 'prescription', loadChildren: () => import('../pages/prescription/prescription.module').then(m => m.PrescriptionPageModule) },
  // tslint:disable-next-line: max-line-length
  { path: 'prescription-detail', loadChildren: () => import('../pages/prescription-detail/prescription-detail.module').then(m => m.PrescriptionDetailPageModule) },
  // tslint:disable-next-line: max-line-length
  { path: 'modal-accept-postponed', loadChildren: () => import('../pages/modal-accept-postponed/modal-accept-postponed.module').then(m => m.ModalAcceptPostponedPageModule) },
  { path: 'payment', loadChildren: () => import('../pages/payment/payment.module').then(m => m.PaymentPageModule) },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
