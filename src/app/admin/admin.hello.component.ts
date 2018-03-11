import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-cabinet',
  templateUrl: './admin.hello.component.html',
})

export class AdminHelloComponent implements OnInit {
  name: string;
  want = false;
  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: any) {}

  ngOnInit(): void {
    if (localStorage.getItem('token') === null) {
      this.document.location.href = '';
    }
    let httpOptions = {};
    if (localStorage.getItem('token') != null) {
      httpOptions = {
        headers: new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('token')})
      };
    }
    this.http.get('http://localhost:8080/welcome/isAdmin', httpOptions).subscribe((isAdmin: boolean) => {
      if (!isAdmin) {
        this.document.location.href = '/cabinet';
      }
    });
  }
  wantToAddNewWords() {
    this.document.location.href = 'admin/addNewWords';
  }
  wantToAddNewGroups() {
    this.document.location.href = 'admin/addNewGroups';
  }
  wantToSeeAllTasks() {
    this.document.location.href = 'admin/showAllTasks';
  }
  wantToAddNewTask() {
    this.want = true;
  }
  taskText() {
    this.document.location.href = 'admin/addNewText';
  }
  taskVideo() {
    this.document.location.href = 'admin/addNewVideo';
  }
  taskGrammar() {
    this.document.location.href = 'admin/addNewGrammar';
  }
}
