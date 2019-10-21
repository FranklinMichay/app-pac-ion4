import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('../pages/home/home.module').then( m => m.HomePageModule)},
  { path: 'login', loadChildren: () => import('../pages/login/login.module').then( m => m.LoginPageModule)},
  { path: 'forgot-password',  loadChildren: () => import('../pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)},
  { path: 'search-medic', loadChildren: () => import('../pages/search-medic/search-medic.module').then( m => m.SearchMedicPageModule)},
  { path: 'profile', loadChildren: () => import('../pages/profile/profile.module').then( m => m.ProfilePageModule)},
  { path: 'meetings', loadChildren: () => import('../pages/meetings/meetings.module').then( m => m.MeetingsPageModule)},
  { path: 'profile-medic', loadChildren: () => import('../pages/profile-medic/profile-medic.module').then( m => m.ProfileMedicPageModule)},
  { path: 'schedule', loadChildren: () => import('../pages/schedule/schedule.module').then( m => m.SchedulePageModule)},
  { path: 'meetings', loadChildren: () => import('../pages/meetings/meetings.module').then( m => m.MeetingsPageModule)},
  { path: 'register', loadChildren: () => import('../pages/register/register.module').then( m => m.RegisterPageModule)},
  { path: 'get-meeting', loadChildren: () => import('../pages/get-meeting/get-meeting.module').then( m => m.GetMeetingPageModule)},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
