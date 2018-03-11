import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-cabinet',
  template: `
    <div class="w3-bar" style="max-width: 1000px; margin: auto">
      <input class="w3-input w3-border w3-bar-item" type="text" style="width: 40%"
             placeholder="Word" [(ngModel)]="word">
      <input class="w3-input w3-border w3-bar-item" type="text" style="width: 40%"
             placeholder="Translation" [(ngModel)]="translation">
      <button type="button" class="btn btn-outline-dark" style="width: 8%" (click)="addWord()">Add</button>
      <button type="button" class="btn btn-outline-dark" style="width: 10%" (click)="submit()">Submit</button>
    </div>
    <div class="list-group" style="max-width: 1000px; margin: auto">
      <ul id="grouplist" class="list-group">
            <span class="list-group-item" style="width: 80%" *ngFor="let card of basicTaskArray; let i = index">
              <div class="row">
                <div class="w3-col s6 w3-center">{{card.word}}</div>
                <div class="w3-col s6 w3-center">{{card.translation}}
                  <span class="w3-button w3-transparent w3-display-right" (click)="removeWord(i)">&times;</span></div>
              </div>
            </span>
      </ul>
    </div>
  `
})

export class AddWordComponent implements OnInit {
  word: string = null;
  translation: string = null;
  basicTaskArray: Card[] = [];
  POST_URL = 'http://localhost:8080/cards';
  constructor(@Inject(DOCUMENT) private document: any, private http: HttpClient) {}
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

  addWord() {
    console.log("add");
    if (this.word === null || this.translation === null) return;
    this.basicTaskArray.push(new Card(this.word.toLowerCase().trim(), this.translation.toLowerCase().trim()));
    this.word = null;
    this.translation = null;
  }

  removeWord(id: number) {
    this.basicTaskArray.splice(id, 1);
  }

  submit() {
    console.log("submit");
    const task = new BasicTask(this.basicTaskArray);
    let httpOptions = {};
    if (localStorage.getItem('token') != null) {
      httpOptions = {
        headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('token')})
      };
    }
    this.http.put(this.POST_URL, this.basicTaskArray, httpOptions).subscribe();
    this.basicTaskArray.splice(0);
  }
}

export class Card {
  constructor(public word: string, public translation: string) {}
}

export class BasicTask {
  constructor(public array: Card[]) {
  }
}
