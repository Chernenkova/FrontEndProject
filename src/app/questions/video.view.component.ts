import {Component, Inject, Input, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DOCUMENT} from '@angular/common';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector : 'app-video-component',
  template : `
    <div style="max-width: 800px; margin: auto">
      <div class="panel panel-default">
        <div class="panel-body">
          <div style="text-align:center">
            <h1>Happy English</h1>
            <h3 style="text-align: center">Watch the video and answer the questions</h3>
          </div>
          <iframe width="533" height="400" [src]="task.text | safe" style="margin-left: 16%"></iframe>
          <br>
          <br>
          <h3 style="text-align: center">Questions:</h3>
          <div class="list-group">
            <ul id="grouplist" class="list-group">
              <li class="list-group-item" *ngFor="let question of task.questions; let i = index">
                <h4>{{ question.question }}</h4>
                <ul class="w3-ul">
                  <form #f="ngForm">
                    <li *ngFor="let answer of question.possibleAnswers">
                      <div [ngClass]="ngGetClass(i, answer)">
                        <input type="radio" class="w3-radio" value="{{answer}}" name="a{{i}}"
                               (click)="chooseAnswer(i, answer)"
                               [disabled]="checked"/> {{answer}}
                      </div>
                    </li>
                  </form>
                </ul>
              </li>
            </ul>
          </div>
          <div *ngIf="checked" style="margin-left: 38%">
            <h3>Your score is {{response.score}}/{{response.totalScore}}</h3>
            <button style="margin-left: 12%"type="button" class="btn btn-outline-dark"><< Back</button>
          </div>
          <button  style="margin-left: 46%" *ngIf="!checked" type="button" class="btn btn-outline-dark"
                   (click)="check()" [disabled]="checked">Check</button>
        </div>
      </div>
    </div>
  `
})

export class VideoViewComponent implements OnInit {
  @Input() id: number;
  URL_GET = 'http://localhost:8080/questions-text/videoTask/';
  URL_POST = 'http://localhost:8080/questions-text/checkVideo/';

  url = null;
  task: Task;
  answers: Answers = new Answers();
  checked = false;
  request: Req = null;
  response: Resp = null;

  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: any, private router: Router,
              private activatedRouter: ActivatedRoute, private sanitizer: DomSanitizer) {
  }
  ngOnInit(): void {
    this.activatedRouter.params.subscribe((params: Params) => {
      this.id  = params['id'];
    });
    if (localStorage.getItem('token') === null) {
      this.document.location.href = '';
    }
    let httpOptions = {};
    if (localStorage.getItem('token') != null) {
      httpOptions = {
        headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('token')})
      };
    }
    this.http.get(this.URL_GET + this.id.toString(), httpOptions)
      .subscribe((data: Task) => {
        this.task = data;
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.task.text);
      });
  }

  chooseAnswer(i, answer): void {
    this.answers.answers[i] = answer;
  }
  check(): void {
    const r = new Req();
    for (let _i = 0; _i < this.task.questions.length; _i++) {
      if (this.answers.answers[_i] === null) {
        return;
      }
      r.qa[_i] = new QA(this.task.questions[_i].questionUUID, this.answers.answers[_i] );
    }
    this.request = r;
    let httpOptions = {};
    if (localStorage.getItem('token') != null) {
      httpOptions = {
        headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('token')})
      };
    }
    this.http.post(this.URL_POST + this.id.toString(), r, httpOptions).subscribe((data: Resp) => {
      this.response = data;
    });
    this.checked = true;
  }
  ngGetClass(i, item) {
    if (this.response === null) {
      return;
    }
    let quuid = null;
    for (let j = 0; j < this.task.questions.length; j++) {
      if (this.request.qa[j].answer === this.answers.answers[i]) {
        quuid = this.request.qa[j].questionUUID;
      }
    }
    let correctAnswer = null;
    for (let j = 0; j < this.answers.answers.length; j++) {
      if (this.response.answers.qa[j].questionUUID === quuid) {
        correctAnswer = this.response.answers.qa[j].answer;
      }
    }
    if (item === correctAnswer) {
      return 'w3-green';
    } else if (item === this.answers.answers[i]) {
      return 'w3-red';
    }
  }
}
class Answers {
  constructor(public answers: string[] = []) {}
}
class Req {
  constructor(public qa: QA[] = []) {}
}
class QA {
  constructor(public questionUUID: string, public answer: string = null) {}
}
class Task {
  constructor(public text: string, public questions: Question[], public reward: number) {}
}
class Question {
  constructor(public questionUUID: string, public question: string, public possibleAnswers: string[]) {}
}
class Resp {
  constructor(public totalScore: number, public score: number, public answers: Req) {}
}
