import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-updateuser',
  templateUrl: './update.user.component.html',
})

export class UpdateUserComponent implements OnInit {
  firstName: string = null;
  lastName: string = null;
  PUT_URL = 'http://localhost:8080/welcome/' + localStorage.getItem('id');

  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: any) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('token') === null)
      this.document.location.href = '';
  }
  setNewData() {
    const user = {'userFirstname': this.firstName, 'userLastname': this.lastName};
    this.http.put(this.PUT_URL, user).subscribe();
    localStorage.setItem('name', this.firstName);
    this.document.location.href = '/settings';
  }
}
