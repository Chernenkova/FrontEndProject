import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';


@Component({
  selector: 'app-showtasks-comp',
  template:
  `<div class="panel panel-default" style="max-width: 800px; margin: auto">
    <!--delete this div-->
    <div class="w3-container">
      <div>
        <mat-form-field>
          <mat-select [(value)]="selected">
            <mat-option value="all">Все типы</mat-option>
            <mat-option *ngFor="let type of types" value="{{type}}">{{getTextFromType(type)}}</mat-option>
          </mat-select>
        </mat-form-field>
        <div class="w3-right" style="padding-right: 16px; padding-top: 16px" >
          <i *ngIf="!inverted" class="fa fa-arrow-down" (click)="reverseArray()"></i>
          <i *ngIf="inverted"  class="fa fa-arrow-up" (click)="reverseArray()"></i>
          Сортировка по награде
        </div>
      </div>
      <ul class="w3-ul" *ngFor="let task of taskList; let i = index">
        <span *ngIf="!(task.completed && !showAll)">
          <li class="w3-bar w3-border" *ngIf="selected ==='all' || task.type === selected">
            <div [ngClass]="getLiClass(i)" >
              <span (click)="delete(i)" class="w3-bar-item w3-button w3-xlarge w3-right w3-teal">Delete
                <span class="glyphicon glyphicon-trash"></span></span>
              <span *ngIf="task.reward!==0"
                    class="w3-bar-item w3-white w3-xlarge w3-right">{{task.reward}} <span class="glyphicon glyphicon-education"></span>
              </span>
              <div class="w3-bar-item">
                <span class="w3-large">{{task.name}}</span>
                <br>
                <span>
                  <div>
                    <i [ngClass]="getIcon(i)"></i>
                    <span>{{getTextType(i)}}</span>
                  </div>
                </span>
              </div>
            </div>
          </li>
        </span>
      </ul>
    </div>
  </div>`,
  styles: [
    `.completed {color: darkgray;}`
  ]
})


export class ShowAllTasksComponent implements OnInit {

  URL = 'http://localhost:8080/task-progress/all';
  URL_DELETE = 'http://localhost:8080/questions-text/delete/';

  taskList: TaskInfo[] = [];
  types: string[] = [];
  selected = 'all';

  showAll = true;
  inverted = false;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient,
              @Inject(DOCUMENT) private document: any) {}
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
    httpOptions = {};
    if (localStorage.getItem('token') != null) {
      httpOptions = {
        headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('token')})
      };
    }
    this.http.get(this.URL, httpOptions).subscribe((data: TaskInfo[]) => {
      this.taskList = data;
      const set = new Set();
      for (let j = 0; j < data.length; j++) {
        set.add(data[j].type);
      }
      this.types = Array.from(set.values());
    }, error => {
      // TODO: redirect
      console.log('redirect');
    });
  }

  getTextType(i) {
    return this.getTextFromType(this.taskList[i].type);

  }
  getTextFromType(type) {
    if (type === 'CHOOSING') {
      return 'Выбор варианта';
    }
    if (type === 'WRITING') {
      return 'Правописание';
    }
    if (type === 'GRAMMAR') {
      return 'Грамматика';
    }
    if (type === 'VIDEO') {
      return 'Видео';
    }
    if (type === 'QUESTION') {
      return 'Текст с вопросами';
    }
  }
  getIcon(i) {
    if (this.taskList[i].type === 'CHOOSING') {
      return 'glyphicon glyphicon-th-large';
    }
    if (this.taskList[i].type === 'WRITING') {
      return 'glyphicon glyphicon-pencil';
    }
    if (this.taskList[i].type === 'GRAMMAR') {
      return 'fa fa-list-ul';
    }
    if (this.taskList[i].type === 'VIDEO') {
      return 'fa fa-film';
    }
    if (this.taskList[i].type === 'QUESTION') {
      return 'fa fa-question-circle';
    }
  }
  getLiClass(i) {
    return '';
  }

  delete(i): void {
    console.log(this.URL_DELETE + this.taskList[i].id.toString());
    let httpOptions = {};
    if (localStorage.getItem('token') != null) {
      httpOptions = {
        headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('token')})
      };
    }
    this.http.delete(this.URL_DELETE + this.taskList[i].id, httpOptions).subscribe(data => {
      this.document.location.href = 'admin/showAllTasks';
    });
  }
  reverseArray(): void {
    this.inverted = !this.inverted;
    this.taskList = this.taskList.reverse();
  }
}


class TaskInfo {
  constructor(public name: string, public type: string, public reward: number, public id: number, public completed: boolean) {}
}
