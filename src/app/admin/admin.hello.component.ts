import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-cabinet',
  templateUrl: './admin.hello.component.html',
})

export class AdminHelloComponent implements OnInit {
  name: string;
  constructor(@Inject(DOCUMENT) private document: any) {}
  ngOnInit(): void {
    if(localStorage.getItem('token') === null)
      this.document.location.href = '';
    if(localStorage.getItem('id') !== '26')
      this.document.location.href = '';
  }
  wantToAddNewWords() {
    this.document.location.href = 'admin/addNewWords';
  }
  wantToAddNewGroups() {
    this.document.location.href = 'admin/addNewGroups';
  }
}
