import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})

export class SettingsComponent implements OnInit {
  loginSettings: string = null;
  firstName: string = null;
  lastName: string = null;
  id: string = null;
  GET_URL = 'http://localhost:8080/welcome/getUserData';

  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: any, private router: Router) {}
  ngOnInit(): void {
    if(localStorage.getItem('token') === null)
    // this.document.location.href = '';
      this.router.navigate([''])
    let httpOptions = {};
    if (localStorage.getItem('token') != null) {
      httpOptions = {
        headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('token')})
      };
    }
    this.id = localStorage.getItem('id');
    this.http.get(this.GET_URL, httpOptions).subscribe((resp: UserData) => {
      this.firstName = resp.firstName;
      this.lastName = resp.lastName;
      this.loginSettings = resp.login;
    }, err => {
      console.log("error!");
      this.router.navigate(['']);
    });
  }
  updateUser() {
    this.router.navigate(['/updateUser']);
    // this.document.location.href = '/updateUser';
  }
  changePassword() {
    this.router.navigate(['/recover-request']);
    // this.document.location.href = '/recover-request';
  }
}

class UserData {
  constructor (public login: string, public firstName: string, public lastName: string) {}
}
