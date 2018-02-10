import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-cabinet',
  template: `
    <div style="text-align:center">
      <h1>Happy English</h1>
      <h2>Welcome, {{name}}!</h2>
      <div class="w3-padding-16">
        <button class="w3-teal" mat-button="" (click)="toDictionary()"><span class="fa fa-book"></span> Мой словарь</button>
      </div>
    </div>
    <app-tasklist-comp></app-tasklist-comp>
  `,
})

export class CabinetComponent implements OnInit {
  name: string;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, public dialog: MatDialog, private http: HttpClient) {}
  ngOnInit(): void {
    if (localStorage.getItem('token') === null) {
      // this.document.location.href = '';
      this.router.navigate(['']);
    }
    this.name = localStorage.getItem('name');
  }
  toDictionary(): void {
    this.router.navigate(['/dictionary']);
  }
}
