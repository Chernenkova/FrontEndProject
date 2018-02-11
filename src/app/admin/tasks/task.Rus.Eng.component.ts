import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-re-create',
  template: ``
})

export class TaskRusEngComponent implements OnInit {
  constructor(@Inject(DOCUMENT) private document: any, private http: HttpClient) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('token') === null)
      this.document.location.href = '';
    if (localStorage.getItem('id') !== '26')
      this.document.location.href = '';
  }
}
