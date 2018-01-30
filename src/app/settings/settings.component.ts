import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})

export class SettingsComponent implements OnInit {
  loginSettings: string = null;
  firstName: string = null;
  lastName: string = null;
  id: string = null;
  GET_URL = 'http://localhost:8080/welcome/getUser';

  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: any) {}
  ngOnInit(): void {
    if(localStorage.getItem('token') === null)
      this.document.location.href = '';
    this.id = localStorage.getItem('id');
    this.GET_URL = this.GET_URL + this.id;
    this.http.get(this.GET_URL, {responseType: 'text'}).subscribe(resp => {
      const data: string[] = resp.split(' ');
      this.loginSettings = data[8].slice(1, data[8].length - 4);
      this.firstName = data[16].slice(1, data[16].length - 4);
      this.lastName = data[20].slice(1, data[20].length - 4);
    }, err => {
      console.log("error!");
    });
  }
  updateUser() {
    this.document.location.href = '/updateUser';
  }
  changePassword() {
    this.document.location.href = '/recover-request';
  }
}
