import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Task} from './task';
import 'rxjs/add/operator/map';
import {DOCUMENT} from '@angular/common';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-card-comp',
  template: `
    {{''+temp}}
    <br>
    this: {{word}}
    <br>
    {{translation}}
    <br>
    {{selectedItem}}
    <div class="panel panel-default my-panel w3-display-container"
         style="max-width: 1000px; margin: auto">
      <div class="panel-heading">
        <div class="center" style="font-size: 32px" *ngIf="indexArray < task.array.length">
          {{indexArray + 1}}/{{task.array.length}} : {{task.array[indexArray].word}}
        </div>
        <div class="center" style="font-size: 32px" *ngIf="indexArray === task.array.length">
          Your score: {{score}}/{{task.array.length}}
        </div>
      </div>
      <div class="panel-body">
        <div class="list-group" *ngIf="indexArray < task.array.length">
          <ul id="grouplist" class="list-group">
            <li class="list-group-item" (click)="listClick($event, pTransl)" [ngClass]=getNgClass(pTransl)
                *ngFor="let pTransl of task.array[indexArray].possibleTranslations; let i = index">
              {{ pTransl }}
            </li>
          </ul>
        </div>
        <div class="w3-clear ">
          <button class="w3-right w3-btn w3-round-large my-nextprev" (click)="next()"
            [disabled]="!selectedItem" *ngIf="indexArray < task.array.length">Next ></button>
          <button (click)="router.navigate(['/cabinet'])" class="w3-right w3-btn w3-round-large my-nextprev"
                  *ngIf="indexArray === task.array.length">Home ></button>
        </div>
      </div>
    </div>`,
  styleUrls: ['./cardstyle.css']
})


export class CardComponent implements OnInit {

  request = 'http://localhost:8080/choosing-translation/task/';
  id;

  task: Task;
  indexArray = 0;
  // for testing
  temp: boolean;
  word: string;
  translation: string;

  selectedItem: string;
  rightResult: string;
  result: boolean;
  ngClassResult: string;
  score = 0;
  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: any, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    if (localStorage.getItem('token') === null) {
      this.router.navigate(['']);
    }
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    let httpOptions = {};
    if (localStorage.getItem('token') != null) {
      httpOptions = {
        headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('token')})
      };
    }
    this.http.get(this.request + this.id, httpOptions).subscribe((data: Task) => this.task = data, error2 => {
      // this.router.navigate(['']);
    });
  }
  next(): void {
    this.indexArray = ++this.indexArray;
    this.selectedItem = null;
    this.rightResult = null;
  }
  prev(): void {
    if (this.indexArray === 0) {
      this.indexArray = this.task.array.length - 1;
    }else {
      this.indexArray--;
    }
  }
  getNgClass(item) {
    if (item === this.selectedItem) {
      if (this.result === true) {
        this.ngClassResult = 'success';
      } else {
        this.ngClassResult = 'fail';
      }
    } else if (item === this.rightResult) {
      this.ngClassResult = 'success';
    } else {
      this.ngClassResult = '';
    }
    return this.ngClassResult;
  }
  listClick(event, newValue) {
    if (this.selectedItem) return;
    this.selectedItem = newValue;  // don't forget to update the model here
    const id = this.task.array[this.indexArray].id;
    const translation = newValue;
    this.translation = translation;
    const w = {'id': id, 'translation': translation};
    let httpOptions = {};
    if (localStorage.getItem('token') != null) {
      httpOptions = {
        headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('token')})
      };
    }
    this.http.post(this.request + 'result', w, httpOptions).subscribe(
      (data: ResponseWrapper) => {
        this.word = data.toString();
        this.rightResult = data.translation;
        this.result = newValue === data.translation;
        if (this.result) this.score++;
      }
    );
  }
}

export class ResponseWrapper {
  constructor(public translation: string) { }
}
