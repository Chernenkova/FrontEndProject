import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-tasklist-comp',
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
        <mat-slide-toggle [(ngModel)]="showAll">Показывать выполенные задания</mat-slide-toggle>
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
              <span (click)="execute(i)" class="w3-bar-item w3-button w3-xlarge w3-right w3-teal">Выполнить</span>
              <span class="w3-bar-item w3-white w3-xlarge w3-right">{{task.reward}} <span class="glyphicon glyphicon-education"></span>
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


export class TaskListComponent implements OnInit {

  URL = 'http://localhost:8080/task-progress';

  taskList: TaskInfo[] = [];
  types: string[] = [];
  selected = 'all';

  showAll = false;
  inverted = false;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient) {}
  ngOnInit(): void {
    let httpOptions = {};
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
  }
  getIcon(i) {
    if (this.taskList[i].type === 'CHOOSING') {
      return 'glyphicon glyphicon-th-large';
    }
    if (this.taskList[i].type === 'WRITING') {
      return 'glyphicon glyphicon-pencil';
    }
  }
  getLiClass(i) {
    if (this.taskList[i].completed === true) {
      return 'completed';
    }
    return '';
  }

  execute(i): void {
    // TODO:
    if (this.taskList[i].type === 'WRITING') {
      this.router.navigate(['/learn-writing/' + this.taskList[i].id]);
    }
    if (this.taskList[i].type === 'CHOOSING') {
      this.router.navigate(['/card/' + this.taskList[i].id]);
    }
  }
  reverseArray(): void {
    this.inverted = !this.inverted;
    this.taskList = this.taskList.reverse();
  }
}


class TaskInfo {
  constructor(public name: string, public type: string, public reward: number, public id: number, public completed: boolean) {}
}
