import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';


@Component({
  selector: 'app-confirm-registration-component',
  template: `
  <div>
    <div>
      <div style="text-align:center">
        <h1>Happy English</h1>
      </div>
      <div style="max-width: 1000px; margin-left: 41%">
        <div class="w3-container">
        </div>
        <p>Заполните поля для завершения регистрации</p>
        <div class="form-group">
          <input type="text" id="pass" class="form-control" style="width: 30%" placeholder="Имя"
                 [(ngModel)]="firstName">
        </div>
        <div class="form-group">
          <input type="text" class="form-control" id="pass" style="width: 30%"
                 placeholder="Фамилия" [(ngModel)]="lastName">
        </div>
        <div style="margin: auto">
          <button type="button" class="btn btn-outline-dark" (click)="confirm()">Закончить регистрацию</button>
        </div>
      </div>
    </div>
    \`
  </div>
  `
})



export class ConfirmRegistrationComponent implements OnInit {

  URL = 'http://localhost:8080/welcome/confirm/';

  firstName: string = null;
  lastName: string = null;
  uuid: string = null;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.uuid = params['id'];
    });
  }


  constructor(private router: Router, private activatedRoute: ActivatedRoute, public dialog: MatDialog, private http: HttpClient) {}

  confirm(): void {
    if (this.firstName === null || this.lastName === null || this.firstName.trim().length === 0 || this.lastName.trim().length === 0) {
      // TODO: warning
      this.openDialog();
    }
    const DATA = {'userFirstname': this.firstName, 'userLastname': this.lastName};
    this.http.post(this.URL + this.uuid, DATA).subscribe();
    this.router.navigate(['']);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogWarningComponent);

    dialogRef.afterClosed().subscribe();

  }
}

@Component({
  selector: 'app-dialog-warning',
  template: `<h1 mat-dialog-title>Поля не должны быть пустыми</h1>
  <div mat-dialog-content>
    <button style="margin: auto" mat-button (click)="onNoClick()">Ok</button>
  </div>`
})
export class DialogWarningComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogWarningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
