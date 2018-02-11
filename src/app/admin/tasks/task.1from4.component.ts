import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-1from4-create',
  template: `
    <div>
    <div class="w3-bar">
    <input class="w3-input w3-border w3-bar-item" type="text" style="width: 40%"
           placeholder="Word" [(ngModel)]="word">
    <input class="w3-input w3-border w3-bar-item" type="text" style="width: 40%"
           placeholder="Translation" [(ngModel)]="translation">
    <input class="w3-input w3-border w3-bar-item" type="text" style="width: 40%;"
           placeholder="Translation" [(ngModel)]="translation1">
    <input class="w3-input w3-border w3-bar-item" type="text" style="width: 40%;"
           placeholder="Translation" [(ngModel)]="translation2">
    <input class="w3-input w3-border w3-bar-item" type="text" style="width: 40%;"
           placeholder="Translation" [(ngModel)]="translation3">
    <button class="w3-button w3-bar-item w3-teal" style="width: 8%" (click)="addWord()">Add</button>
    <button class="w3-button w3-right w3-green" style="width: 10%" (click)="submit()">Submit</button>
    </div>
  </div>`
})

export class Task1from4Component implements OnInit {
  constructor(@Inject(DOCUMENT) private document: any, private http: HttpClient) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('token') === null)
      this.document.location.href = '';
    if (localStorage.getItem('id') !== '26')
      this.document.location.href = '';
  }
}
