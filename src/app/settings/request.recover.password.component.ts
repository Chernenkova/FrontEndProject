import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-request-recover-comp',
  template: `
    <div>
      <div style="text-align:center">
        <h1>Happy English</h1>
      </div>
      <div style="max-width: 1000px; margin:auto; text-align: center">
        <label>Enter the E-mail address to which to send the password change information</label>
        <br><br>
        <div class="w3-row" style="margin-left: 25%">
          <input class="w3-col form-control l8" [(ngModel)]="email" placeholder="E-mail"/>
        </div>
        <br>
          <div class="w3-col l4" style="margin-left: 33%">
            <button type="button" class="btn btn-outline-dark" (click)="confirm()">Confirm</button>
          </div>
        </div>
      </div>
  `
})


export class RequestRecoverPasswordComponent {
  URL = 'http://localhost:8080/recover-password/request/';
  email: string = null;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient) {}

  confirm() {
    console.log(this.email);
    if (this.email === null) {
      return;
    }
    this.http.post(this.URL, {'email': this.email}).subscribe();
    // TODO: redirect ot home
    this.router.navigate(['/']);
  }
}
