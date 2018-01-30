import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';


@Component({
  selector: 'app-tasklist-comp',
  template:
  `<div class="panel panel-default" style="max-width: 800px; margin: auto">
    <!--delete this div-->
    <div class="w3-container">
      <div>
        <mat-form-field>
          <mat-select [(value)]="selected">
            <mat-option value="all">ALL</mat-option>
            <mat-option *ngFor="let type of types" value="{{type}}">{{type}}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <ul class="w3-ul" *ngFor="let task of taskList; let i = index">
        <li class="w3-bar w3-border" *ngIf="selected ==='all' || task.type === selected">
          <span (click)="execute(i)" class="w3-bar-item w3-button w3-xlarge w3-right w3-teal">Execute</span>
          <span class="w3-bar-item w3-white w3-xlarge w3-right">reward: {{task.reward}}</span>
          <div class="w3-bar-item">
            <span class="w3-large">{{task.name}}</span>
            <br>
            <span>{{task.type}}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>`
})


export class TaskListComponent implements OnInit {

  URL = 'http://localhost:8080/task-progress';

  taskList: TaskInfo[] = [];
  types: string[] = [];
  selected = 'all';
  constructor(private http: HttpClient) {}
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

  execute(i): void {
    // TODO:
    console.log(i);
  }
}


class TaskInfo {
  constructor(public name: string, public type: string, public reward: number, public id: number) {}
}
