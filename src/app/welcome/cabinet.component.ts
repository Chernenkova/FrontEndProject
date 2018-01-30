import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-cabinet',
  template: `
    <div style="text-align:center">
      <h1>Happy English</h1>
      <h2>Welcome, {{name}}!</h2>
    </div>
    <app-tasklist-comp></app-tasklist-comp>
  `,
})

export class CabinetComponent implements OnInit {
  name: string;
  constructor(@Inject(DOCUMENT) private document: any) {}
  ngOnInit(): void {
    if(localStorage.getItem('token') === null)
      this.document.location.href = '';
    this.name = localStorage.getItem('name');
  }
}
