import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-my',
  template: `<div>
    <nav class="navbar navbar-default navbar-fixed-top navbar-inverse" role="navigation">
      <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header navbar-left">
          <div *ngIf="try(); else unset">
            <a class="navbar-brand" href="#"><span class="glyphicon glyphicon-user"> Hello, {{userName.trim()}}!  {{raiting}}</span></a>
            <button type="button" class="btn btn-default" (click)="sett()"><span class="glyphicon glyphicon-cog"></span> Settings</button>
            <button type="button" class="btn btn-default" (click)="signOut()">Sign out</button>
          </div>
          <ng-template #unset>
            <a class="navbar-brand" href="#"><span class="glyphicon glyphicon-user"> Hello!</span></a>
            <button type="button" class="btn btn-default" (click)="wantToSignIn()">Sign in</button>
            <button type="button" class="btn btn-default" (click)="wantToSignUp()">Sign up</button>
          </ng-template>

        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav nav-stacked">

          </ul>
        </div><!-- /.navbar-collapse -->
      </div><!-- /.container-fluid -->
    </nav>
                    <router-outlet></router-outlet>
               </div>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  loginIn: boolean;
  userName: string = null;
  raiting: string = null;

   constructor(private router: Router, @Inject(DOCUMENT) private document: any) {}
  ngOnInit(): void {
    this.userName = localStorage.getItem('name');
    this.raiting = localStorage.getItem('raiting');
  }
  try(): boolean {
    if(localStorage.getItem('name') === null)
      return false;
    this.userName = localStorage.getItem('name');
    this.loginIn = this.userName.length !== 0;
    this.raiting = localStorage.getItem('raiting');
    return this.loginIn;
  }

  signOut() {
    this.loginIn = false;
    this.userName = null;
    this.raiting = null;
    localStorage.clear();
    this.try();
    this.document.location.href = '';
  }
  wantToSignIn() {
    this.document.location.href = '';
  }
  wantToSignUp() {
    this.document.location.href = '/signUp';
  }
  sett() {
    this.document.location.href = '/settings';
  }
}
