import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-recover-comp',
  template: `
  <div>
    <div style="text-align:center">
      <h1>Happy English</h1>
    </div>
    <div style="max-width: 1000px; margin-left: 41%">
      <div class="w3-container">
      </div>
      <div class="form-group">
        <input  type="password"  id="pass" class="form-control" style="width: 30%" placeholder="New password"
               [(ngModel)]="password" required pattern="[0-9a-zA-Z]{6,}" >
      </div>
      <div class="form-group">
        <input  type="password"  class="form-control" id="pass" style="width: 30%"
               placeholder="Confirm password" [(ngModel)]="passwordRepeat"  required pattern="[0-9a-zA-Z]{6,}" >
      </div >
      <div style="margin-left: 10%">
        <button type="button" class="btn btn-outline-dark" (click)="confirm()">Confirm</button>
      </div>
    </div>
  </div>`,
  styles: [
    `ok{
      border-color: #34d849;
    }`,
    `wrong{
      border-color: #d82636;
    }`
  ]
})

export class RecoverPasswordComponent implements OnInit {
  URL = 'http://localhost:8080/recover-password/confirm/';
  uuid = null;
  password: string = null;
  passwordRepeat: string = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, public dialog: MatDialog, private http: HttpClient) {}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.uuid = params['id'];
    });
  }
  confirm() {
    if (this.password !== this.passwordRepeat) {
      this.openDialog();
      return;
    }
    this.http.post(this.URL + this.uuid, {'password': this.password}).subscribe();
    // TODO: redirect To Home
    this.router.navigate(['/']);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogPasswordWarningComponent);

    dialogRef.afterClosed().subscribe();

  }
  getClass() {
    if (this.password === null || this.passwordRepeat === null) {
      return 'form-control';
    }
    if (this.password !== this.passwordRepeat) {
      return 'wrong';
    }
    return 'ok';
  }
}
@Component({
  selector: 'app-dialog-confirm',
  template: `<h1 mat-dialog-title>Пароли не совпадают</h1>
  <div mat-dialog-content>
    <button style="margin: auto" mat-button (click)="onNoClick()">Ok</button>
  </div>`
})
export class DialogPasswordWarningComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogPasswordWarningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
