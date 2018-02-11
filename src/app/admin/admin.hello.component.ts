import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-cabinet',
  templateUrl: './admin.hello.component.html',
})

export class AdminHelloComponent implements OnInit {
  name: string;
  want = false;
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
  wantToAddNewTask() {
    this.want = true;
  }
  taskEngRus() {
    this.document.location.href = 'admin/addNewEngRus';
  }
  taskRusEng() {
    this.document.location.href = 'admin/addNewRusEng';
  }
  task1from4() {
    this.document.location.href = 'admin/addNew1from4';
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
