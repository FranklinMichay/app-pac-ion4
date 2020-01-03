import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  data: any
  timeDiff: any;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.data = JSON.parse(localStorage.getItem('user'))
  }

  returnHome() {
    this.router.navigate(['home']);
  }

  goEditProfile() {
    this.router.navigate(['edit-profile'], { state: this.data });
  }


}
