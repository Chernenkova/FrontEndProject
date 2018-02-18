import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DOCUMENT} from '@angular/common';
import {DialogWarningEmailComponent} from '../welcome/welcome.sign.up.component';


@Component({
  selector: 'app-cabinet',
  template: `
    <div style="text-align:center">
      <h1>Happy English</h1>
      <h2>Adding new groups</h2>
    </div>
    <div class="panel panel-default" style="max-width: 1000px; margin: auto">
      <!--delete this DIV ^^^^^^-->
      <div class="">
        <div class="example-container mat-elevation-z8">
          <mat-form-field style="max-width: 500px; margin-left: 41%">
            <input matInput (keyup)="applyFilter($event.target.value)" placeholder="Search">
          </mat-form-field>
          <mat-table #table [dataSource]="dataSource" matSort>

            <!-- Checkbox Column -->
            <ng-container matColumnDef="select">
              <mat-header-cell *matHeaderCellDef>
                <mat-checkbox (change)="$event ? masterToggle() : null"
                              [checked]="selection.hasValue() && isAllSelected()"
                              [indeterminate]="selection.hasValue() && !isAllSelected()">
                </mat-checkbox>
              </mat-header-cell>
              <mat-cell *matCellDef="let row">
                <mat-checkbox (click)="$event.stopPropagation()"
                              (change)="$event ? selection.toggle(row) : null"
                              [checked]="selection.isSelected(row)">
                </mat-checkbox>
              </mat-cell>
            </ng-container>
            <!-- Word Column -->
            <ng-container matColumnDef="word">
              <mat-header-cell *matHeaderCellDef mat-sort-header> Word </mat-header-cell>
              <mat-cell *matCellDef="let element"> {{element.word}} </mat-cell>
            </ng-container>
            <!-- Translation Column -->
            <ng-container matColumnDef="translation">
              <mat-header-cell *matHeaderCellDef mat-sort-header> Translation </mat-header-cell>
              <mat-cell *matCellDef="let element"> {{element.translation}} </mat-cell>
            </ng-container>
            <!--asd -->
            <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
            <mat-row *matRowDef="let row; columns: displayedColumns;"
                     (click)="selection.toggle(row)">
            </mat-row>
          </mat-table>
          <div class="w3-row">
            <div class="w3-col l6 m6" style="margin-top: 7px; padding-left: 5%">
              <button type="button" class="btn btn-outline-dark" [disabled]="this.selection.isEmpty()"
              (click)="openDialog()">Add to a new group</button>
            </div>
            <mat-paginator #paginator class="w3-col l6 m6"
                           [pageSize]="10"
                           [pageSizeOptions]="[1, 10, 20, 50]">
            </mat-paginator>
          </div>
        </div>
      </div>
    </div>
  `
})

export class AdminAddNewGroupComponent implements OnInit {
  URL = 'http://localhost:8080/cards';
  URL_CREATE = 'http://localhost:8080/choosing-translation/create';
  word: string = null;
  translation: string = null;

  confirmDelete: string = null;

  dictionary: Card[] = [];
  displayedColumns = ['select', 'word', 'translation'];
  dataSource;
  selection = new SelectionModel<Card>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private http: HttpClient, public dialog: MatDialog, @Inject(DOCUMENT) private document: any) {}
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
    this.http.get(this.URL, httpOptions).subscribe((data: Card[]) => {
      this.dictionary = data.map(x => Object.assign({}, x));
      this.dataSource = new MatTableDataSource<Card>(this.dictionary);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      // TODO: redirect
      console.log('redirect');
    });
  }

  deleteWords(): void {
    if (this.selection.isEmpty()) return;
    let httpOptions = {};
    if (localStorage.getItem('token') != null) {
      httpOptions = {
        headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('token')})
      };
    }
    this.http.post(this.URL + '/delete', this.selection.selected, httpOptions).subscribe((data: Card[]) => {
      this.dictionary = data.map(x => Object.assign({}, x));
      this.dataSource = new MatTableDataSource<Card>(this.dictionary);
      this.dataSource.paginator = this.paginator;
      this.selection = new SelectionModel<Card>(true, []);
    });
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  openDialogMessage(message): void {
    const dialogRef = this.dialog.open(DialogWarningEmailComponent, {data: {'message': message}});

    dialogRef.afterClosed().subscribe();

  }

  openDialog(): void {

    const dialogRef = this.dialog.open(DialogCreateTaskComponent, {
      data: {'dataCreate': new DataCreate(null, null, null, null)}
    });

    dialogRef.afterClosed().subscribe((result: DataCreate) => {
      if (result.type === null || result.minrate === null || result.reward === null || result.name === null) {
        this.openDialogMessage('Введены не все поля, не получается создать задание');
        return;
      } else {
        let httpOptions = {};
        if (localStorage.getItem('token') != null) {
          httpOptions = {
            headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('token')})
          };
        }
        this.http.post(this.URL_CREATE, {'name': result.name, 'reward': result.reward, 'minrate': result.minrate, 'type': result.type,
                        'array': this.selection.selected}, httpOptions).subscribe(result2 => {
                          this.openDialogMessage('Успешно');
                          }, error2 => {
                          this.openDialogMessage('Ошибка');
        });
      }

    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

}

export class Card {
  constructor(public word: string, public translation: string) {}
}

export class BasicTask {
  constructor(public array: Card[]) {
  }
}

@Component({
  selector: 'app-dialog-confirm',
  template: `
    <h1 mat-dialog-title>Параметры задания</h1>
  <div mat-dialog-content>
    <mat-form-field>
      <input matInput [(ngModel)]="data.dataCreate.name" placeholder="Название">
    </mat-form-field>
    <mat-form-field>
      <input matInput [(ngModel)]="data.dataCreate.reward" placeholder="Стоимость задания">
    </mat-form-field>
    <mat-form-field>
      <input matInput [(ngModel)]="data.dataCreate.minrate" placeholder="Минимальный рейтинг">
    </mat-form-field>
    <mat-form-field>
      <mat-select [(value)]="data.dataCreate.type">
        <mat-option value="CHOOSING">Выбор слов</mat-option>
        <mat-option value="WRITING">Правописание</mat-option>
      </mat-select>
    </mat-form-field>
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">Cancel</button>
    <button mat-button [mat-dialog-close]="data.dataCreate" cdkFocusInitial>Ok</button>
  </div>`
})



export class DialogCreateTaskComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogCreateTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
class DataCreate {
  constructor(public name: string, public reward: number, public minrate: number, public type: string) {
  }
}
