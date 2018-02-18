import {Component, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {DOCUMENT} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-welcome',
  template: `
    <div>
      <div style="text-align:center">
        <div style="margin-left: 1%"><img src="../../assets/123.png"/></div>
        <h2>Welcome!</h2>
        <h3>Please, sign up:</h3>
      </div>
      <div *ngIf="error" style="text-align:center">
        Error! Please, try again!
      </div>
      <div class="form-group" style="margin-left: 41%">
        <label for="email" style="margin-left: 13%">Login</label>
        <input type="email" class="form-control" id="email" style="width: 30%" placeholder="Please, enter login"
               [(ngModel)]="login" #email="ngModel"
               required pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$">
      </div>
      <div class="form-group" style="margin-left: 41%">
        <label for="pass" style="margin-left: 12%">Password</label>
        <input type="password" class="form-control" id="pass" style="width: 30%" placeholder="Please, enter password"
               [(ngModel)]="password" required pattern="[0-9a-zA-Z]{6,}">
      </div>
      <div class="form-group" style="margin-left: 41%">
        <label for="pass" style="margin-left: 9.5%">Repeat password</label>
        <input type="password" class="form-control" id="pass" style="width: 30%"
               placeholder="Please, repeat your password" [(ngModel)]="passwordRepeat" required
               pattern="[0-9a-zA-Z]{6,}">
      </div>
      <button type="submit" class="btn btn-outline-dark" (click)="signUp()" style="margin-left: 47.5%">Sign up</button>
    </div>
  `,
  styleUrls: ['../../styles.css'],
  styles: [`
        input.ng-touched.ng-invalid {border:solid red 2px;}
        input.ng-touched.ng-valid {border:solid green 2px;}
    `],
})


export class WelcomeSignUpComponent {
  login: string = null;
  password: string = null;
  token: string = null;
  name: string = null;
  id: string = null;
  passwordRepeat: string = null;
  loginIn = false;
  error = false;
  loading = false;
  POST2_URL = 'http://localhost:8080/welcome';
  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: any, private router: Router,
              private activatedRoute: ActivatedRoute, public dialog: MatDialog) {}
  // signUp() {
  //   this.loading = false;
  //   const user = {'username': this.login, 'userPassword': this.password, 'userRepeatedPassword': this.passwordRepeat};
  //   if ((this.password === null) || (this.login === null) || (this.passwordRepeat === null) || (this.password !== this.passwordRepeat)) {
  //     this.error = true;
  //     return;
  //   }
  //   this.http.post(this.POST2_URL, user, {responseType: 'text'}).subscribe(resp => {
  //     this.loading = true;
  //   }, err => {
  //     this.error = true;
  //     this.loading = true;
  //   });
  //   const timerId = setInterval(function (object) {
  //     console.log("hi");
  //     if (object.loading === true) {
  //       if (object.error === false) {
  //         console.log("Everything is OK");
  //         object.wantToSignIn();
  //       }
  //       clearInterval(timerId);
  //     }
  //   }, 500, this);
  // }

  signUp(): void {
    if ((this.password === null) || (this.login === null) || (this.passwordRepeat === null) || (this.password !== this.passwordRepeat)) {
      this.error = true;
      return;
    }
    this.http.post(this.POST2_URL + '/register', {'login': this.login, 'password': this.password}).subscribe(resp => {
      this.openDialog('На указанный E-mail отпралено письмо для подтверждения');
      this.router.navigate(['']);
    }, error2 => {
      this.error = true;
      this.openDialog('Такой E-mail уже использован');
    });
  }

  openDialog(message): void {
    const dialogRef = this.dialog.open(DialogWarningEmailComponent, {data: {'message': message}});

    dialogRef.afterClosed().subscribe();

  }
}


export class TokenWrapper {
  constructor(public token: string) {}
}

@Component({
  selector: 'app-dialog-email-warning',
  template: `<h1 mat-dialog-title>{{data.message}}</h1>
  <div mat-dialog-content>
    <button style="margin: auto" mat-button (click)="onNoClick()">Ok</button>
  </div>`
})
export class DialogWarningEmailComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogWarningEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
