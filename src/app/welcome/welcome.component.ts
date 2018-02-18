import {Component, Inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {DOCUMENT} from '@angular/common';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['../../styles.css'],
  styles: [`
        input.ng-touched.ng-invalid {border:solid red 2px;}
        input.ng-touched.ng-valid {border:solid green 2px;}
    `],
})


export class WelcomeComponent {
  login: string = null;
  password: string = null;
  token: string = null;
  name: string = null;
  id: string = null;
  passwordRepeat: string = null;
  loginIn = false;
  error = false;
  loading = false;
  raiting: string = null;
  POST_URL = 'http://localhost:8080/welcome/loginSettings';
  POST2_URL = 'http://localhost:8080/welcome';
  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: any) {}

  signIn() {
    // this.document.location.href = '/dictionary';
    const user = {'username': this.login, 'userPassword': this.password};
    this.loading = false;
    if ((this.password === null) || (this.login === null)) {
      this.error = true;
      return;
    } else {
      this.error = false;
    }
    this.http.post(this.POST2_URL + '/login', user, {responseType: 'text'}).subscribe(resp => {
      const data: string[] = resp.split('"');
      this.token = data[15]; // 11
      this.name = data[6].slice(0, data[6].length - 1);
      this.raiting = data[10].slice(0, data[10].length - 1);
      this.id = data[14].slice(0, data[14].length - 1);
      localStorage.setItem('id', this.id);
      localStorage.setItem('token', this.token);
      localStorage.setItem('name', this.name);
      localStorage.setItem('raiting', this.raiting);
      this.loading = true;
      let httpOptions = {};
      if (localStorage.getItem('token') != null) {
        httpOptions = {
          headers: new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('token')})
        };
      }
      this.http.get('http://localhost:8080/welcome/isAdmin', httpOptions).subscribe((isAdmin: boolean) => {
        if (!isAdmin) {
          this.document.location.href = '/cabinet';
        } else {
          this.document.location.href = '/admin';
        }
      });
    }, err => {
      console.log("Error!!!");
      this.error = true;
      this.loading = true;
    });
    const timerId = setInterval(function (object) {
      if (object.loading === true) {
        if (object.error === false) {
          console.log("Everything is OK");
          object.loginIn = true;
        }
        clearInterval(timerId);
      }
    }, 500, this);
  }
  signUp() {
    this.loading = false;
    const user = {'username': this.login, 'userPassword': this.password, 'userRepeatedPassword': this.passwordRepeat};
    if ((this.password === null) || (this.login === null) || (this.passwordRepeat === null) || (this.password !== this.passwordRepeat)) {
      this.error = true;
      return;
    }
    this.http.post(this.POST2_URL, user, {responseType: 'text'}).subscribe(resp => {
      this.loading = true;
    }, err => {
      this.error = true;
      this.loading = true;
    });
    const timerId = setInterval(function (object) {
      console.log("hi");
      if (object.loading === true) {
        if (object.error === false) {
          console.log("Everything is OK");
          object.wantToSignIn();
        }
        clearInterval(timerId);
      }
    }, 500, this);
  }
}


export class TokenWrapper {
  constructor(public token: string) {}
}
