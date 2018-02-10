import {Component, ElementRef, OnInit, Renderer, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Params, Router} from '@angular/router';


@Component({
  selector: 'app-learn-component',
  host: {'(window:keydown)': 'hotkeys($event)'},
  template: `
    <div>
      <div style="max-width: 1000px; margin: auto">
        <div>
          <div class="w3-row" *ngIf="!result">
            <div class="w3-col l2 m2 s3">
              Прогресс: {{index + 1}}/{{array.length}}
              <br>
              <mat-progress-bar mode="determined" [value]="(index + 1)/ array.length * 100"></mat-progress-bar>
              Правильно: {{correct.length}}
            </div>
            <div class="w3-col l10 m10 s9">
              <div class="w3-row">
                <div class="w3-col m6 s6 l6">
                  <div style="padding-left: 20%">
                    Введите перевод для <code>{{array[index].translation}}</code>
                    <br>
                    <div *ngIf="writing">
                      <mat-form-field class="">
                        <input autofocus #myinput matInput [(ngModel)]="str">
                      </mat-form-field>
                    </div>
                    <div *ngIf="!writing" style="font-size: 17pt">
                      <div *ngIf="correctWord">
                        <span style="color: #34d849; ">Верно!</span>
                        <code>{{array[index].word}}</code>
                      </div>
                      <div *ngIf="!correctWord">
                        <span style="color: #d82636; ">Неверно!</span>
                        <code>{{array[index].word}}</code>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="w3-col m6 s6 l6">
                  <button mat-button class="w3-teal" (click)="click()">{{buttonTitle}}</button>
                </div>
              </div>
            </div>
          </div>
          <div *ngIf="result">
            <ul class="w3-ul w3-border">
              <li *ngFor="let item of stat; let i = index">
                Попытка {{i + 1}}
                <ul class="w3-ul w3-border">
                  <li *ngFor="let word of item.correct; let j = index">
                    <div class="w3-row">
                      <div class="w3-col m6 s6 l6">
                        {{word.word}}
                      </div>
                      <div class="w3-col m6 s6 l6">
                        {{word.translation}}
                      </div>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
            <br/>
            <button mat-button="" class="w3-teal" (click)="ngOnInit()">Еще раз</button>
            <button mat-button="" *ngIf="mode === 'DICTIONARY'" class="w3-teal" (click)="toDictionary()">Назад к словарю</button>
            <button mat-button="" *ngIf="mode === 'TASK'" class="w3-teal" (click)="toHome()">Домой</button>
          </div>
        </div>
      </div>
    </div>
  `
})


export class LearnWritingComponent implements OnInit {

  URL = 'http://localhost:8080/task-writing/';
  URL_COMPLETE = 'http://localhost:8080/task-progress/';

  str: string;
  id: string;
  mode: string; // TASK || DICTIONARY
  array: Card[] = [];
  index = 0;
  correct: Card[] = [];
  wrong: Card[] = [];
  buttonTitle = null;

  writing = true;
  correctWord = true;
  stat: Statistics[] = [];
  result = false;

  @ViewChild('myinput') private elementRef: ElementRef;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.initVar();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    if (this.id === 'dictionary') {
      this.buttonTitle = 'Проверить';
      this.mode = 'DICTIONARY';
      this.array = JSON.parse(localStorage.getItem('dictionary'));
    } else {
      let httpOptions = {};
      if (localStorage.getItem('token') != null) {
        httpOptions = {
          headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('token')})
        };
      }
      this.mode = 'TASK';
      this.buttonTitle = 'Проверить';
      this.http.get(this.URL + this.id, httpOptions).subscribe((data: Card[]) =>{
        this.array = data;
      }, error2 => {
        this.router.navigate(['']);
      });
    }
  }

  initVar(): void {
    this.array = [];
    this.index = 0;
    this.correct = [];
    this.wrong = [];
    this.writing = true;
    this.correctWord = true;
    this.stat = [];
    this.result = false;
  }

  hotkeys(event) {
    // Enter key
    if (event.keyCode === 13) {
      if (this.mode === 'DICTIONARY' || this.mode === 'TASK') {
        this.click();
      }
    }
    this.elementRef.nativeElement.focus();
  }

  click(): void {
    if (this.mode === 'DICTIONARY' || this.mode === 'TASK') {
      if (this.writing) {
        const card = this.array[this.index];
        if (card.word === this.str) {
          this.correct.push(card);
          this.correctWord = true;
        } else {
          this.wrong.push(card);
          this.correctWord = false;
        }
        this.writing = false;
        this.str = null;
        this.buttonTitle = 'Дальше';
      } else {
        this.index++;
        if (this.index === this.array.length) {
          this.stat.push(new Statistics(this.correct.copyWithin(this.correct.length, 0)));
          this.array = this.wrong;
          this.correct = [];
          this.wrong = [];
          this.index = 0;
          if (this.array.length === 0) {
            this.result = true;
            let httpOptions = {};
            if (localStorage.getItem('token') != null) {
              httpOptions = {
                headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('token')})
              };
            }
            this.http.post(this.URL_COMPLETE + this.id, null, httpOptions).subscribe((rating: number) => {
              localStorage.setItem('raiting', '' + rating);
            });
          }
        }
        this.writing = true;
        this.buttonTitle = 'Проверить';
      }
    }
  }

  toDictionary(): void {
    localStorage.removeItem('dictionary');
    this.router.navigate(['/dictionary']);
  }
  toHome(): void {
    this.router.navigate(['/cabinet']);
  }

}


class Card {
  constructor(public word: string, public translation: string) {
  }
}

class Statistics {
  constructor(public correct: Card[]) {
  }
}

