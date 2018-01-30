import {Component, Inject, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DOCUMENT} from '@angular/common';


@Component ({
  selector : 'app-creating-questions',
  template: `
    <div style="margin: auto; padding: 50px">
      <div class="panel panel-default">
        <h3>Type the text:</h3>
        <div style="padding: 10px">
          <textarea class="form-control" tabindex="0" aria-multiline="true" rows="10"
                    style="overflow: auto; word-wrap: break-word; max-width: 100%; padding: 10px"
                    [(ngModel)]="text">
          </textarea>
        </div>
        <h3>question editor:</h3>
        <div style="padding: 10px">
          <div class="panel panel-default" style="padding: 10px">
            <input class="w3-input" style="width: 95%" type="text" [(ngModel)]="question" placeholder="Add question">
            <div class="w3-bar">
              <div class="w3-left" style="width: 95%">
                <input class="w3-input" type="text" [(ngModel)]="answer" placeholder="Add answer">
              </div>
              <button class="w3-button w3-teal w3-right" (click)="addToArray()">+</button>
            </div>
            <h5>Possible answers:</h5>
            <ul>
              <li class="w3-bar" *ngFor="let answ of answers; let i = index">
                <span class="w3-bar-item w3-button w3-white w3-left" (click)="removeFromArray(i)">x</span>
                <h5>{{answ}}</h5>
            </ul>
            <button class="w3-button w3-teal" (click)="addQuestion()">Add this question</button>
          </div>
        </div>
        <h3>Questions:</h3>
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
        <button class="w3-button w3-teal w3-right" (click)="submit()">Add this task</button>
      </div>
    </div>
  `

})

export class CreatingQuestionComponent implements OnInit {
  constructor (private http: HttpClient, @Inject(DOCUMENT) private document: any) {}
  text: string = null;

  question: string = null;
  answer: string = null;
  answers: string[] = [];

  DOMAIN = 'http://localhost:8080';
  POST = '/questions-text/create';

  readyQuestions: Question[] = [];
  ngOnInit(): void {
    if(localStorage.getItem('token') === null)
      this.document.location.href = '';
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
    if (this.text === null || this.readyQuestions.length === 0) return;
    for (let l = 0; l < this.readyQuestions.length; l++) {
      if (this.readyQuestions[l].answer === null) return;
    }
    const t = new Task(this.text, this.readyQuestions);
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
  constructor(public text: string, public questions: Question[]) {}
}
