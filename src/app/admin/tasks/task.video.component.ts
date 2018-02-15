import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-video-create',
  template: `
    <div style="text-align:center">
      <h1>Happy English</h1>
      <h2>Creating new video task</h2>
    </div>
    <br>
    <div style="max-width: 800px; margin: auto; text-align:center">
    <div class="form-group">
      <h3>The name of a new task &nbsp;  </h3>
      <input style="width: 20%" placeholder="Please, enter a name" [(ngModel)]="name">
    </div>
    <div class="form-group">
      <label>Link for your video: &nbsp;  </label>
      <input style="width: 40%" placeholder="Please, enter a part of the link from Youtube" [(ngModel)]="link">
    </div>
    <div style="text-align: center">
    Attention! You need to enter only this part of the link: <div><img src="../../../assets/link.jpg"/></div>
    </div>
    <div class="form-group">
      <label>Reward for each question: &nbsp;  </label>
      <input style="width: 20%" placeholder="Please, enter a reward" [(ngModel)]="reward">
    </div>
    <div class="form-group">
      <label>The minimum of raiting for access: &nbsp;  </label>
      <input style="width: 20%" placeholder="Please, enter a raiting" [(ngModel)]="minCost">
    </div>
    <div style="max-width: 800px; margin: auto">
      <div style="text-align:center"><h3>Question editor:</h3></div>
      <div style="padding: 10px">
        <div class="panel panel-default" style="padding: 10px">
          <input class="w3-input" style="width: 95%" type="text" [(ngModel)]="question" placeholder="Add question">
          <div class="w3-bar">
            <div class="w3-left" style="width: 95%">
              <input class="w3-input" type="text" [(ngModel)]="answer" placeholder="Add answer">
            </div>
            <button type="button" class="btn btn-dark" (click)="addToArray()">+</button>
          </div>
          <div style="text-align:center"><h5>Possible answers:</h5></div>
          <ul>
            <li class="w3-bar" *ngFor="let answ of answers; let i = index">
              <span class="w3-bar-item w3-button w3-white w3-left" (click)="removeFromArray(i)">x</span>
              <h5>{{answ}}</h5>
          </ul>
          <div><button type="button" class="btn btn-dark" (click)="addQuestion()">Add this question</button></div>
        </div>
      </div>
      <div style="text-align:center"><h3>Questions:</h3></div>
      <div style="padding: 10px">
        <div class="panel panel-default">
          <ul class="w3-ul">
            <li *ngFor="let quest of readyQuestions; let j = index">
              <div class="w3-bar">
                    <span class="w3-bar-item w3-button w3-white w3-left" (click)="removeQuestion(j)">
                      <i class="glyphicon glyphicon-trash"></i>
                    </span>
                <h3 class="w3-bar-item">{{quest.question}}</h3>
              </div>
              <ul class="w3-ul">
                <li *ngFor="let ans of quest.possibleAnswers; let k = index">
                  <input class="w3-radio" type="radio" name="q{{j}}" (click)="chooseAnswer(j, k)">
                  <label>{{ans}}</label>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div><button type="button" class="btn btn-dark" (click)="submit()">Add this task</button></div>
    </div>
    </div>
  `
})

export class TaskVideoComponent implements OnInit {
  link: string;
  reward: number;
  minCost: number;
  name: string;
  constructor(@Inject(DOCUMENT) private document: any, private http: HttpClient) {
  }
  question: string = null;
  answer: string = null;
  answers: string[] = [];

  DOMAIN = 'http://localhost:8080';
  POST = '/questions-text/create-video';
  PATH  = 'https://www.youtube.com/embed/';

  readyQuestions: Question[] = [];

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
  addToArray(): void {
    if (this.answer === null) return;
    this.answers.push(this.answer);
    this.answer = null;
  }
  removeFromArray(i): void {
    this.answers.splice(i, 1);
  }
  addQuestion(): void {
    if (this.question === null || this.answers.length === 0) return;
    const q = new Question(this.question, null, this.answers);
    this.readyQuestions.push(q);
    this.question = null;
    this.answer = null;
    this.answers = [];
  }
  chooseAnswer(j, k): void {
    this.readyQuestions[j].answer = this.readyQuestions[j].possibleAnswers[k];
  }
  removeQuestion(j): void {
    this.readyQuestions.splice(j, 1);
  }
  submit(): void {
    if (this.link === null || this.readyQuestions.length === 0) return;
    for (let l = 0; l < this.readyQuestions.length; l++) {
      if (this.readyQuestions[l].answer === null) return;
    }
    const t = new Task(this.name, this.PATH + this.link, this.readyQuestions, this.reward, this.minCost, localStorage.getItem('id'));
    console.log(JSON.stringify(t));

    let httpOptions = {};
    if (localStorage.getItem('token') != null) {
      httpOptions = {
        headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('token')})
      };
    }
    this.http.post(this.DOMAIN + this.POST, t, httpOptions).subscribe();
  }
}

class Question {
  constructor(public question: string, public answer: string = null, public possibleAnswers: string[]) {}
}
class Task {
  constructor(public name: string, public text: string, public questions: Question[], public reward: number, public minCost: number,
              private authorId: String) {
  }
}
