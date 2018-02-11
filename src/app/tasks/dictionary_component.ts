import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-dictionary',
  template: `
    <div class="panel panel-default" style="max-width: 1000px; margin: auto">
      <!--delete this DIV ^^^^^^-->
      <div class="">
        <div class="example-container mat-elevation-z8">
          <div class="w3-row">
            <mat-form-field style="width: 40%; padding-left: 5%">
              <textarea matInput placeholder="Word" rows="1" style="resize: none" [(ngModel)]="word"></textarea>
            </mat-form-field>
            <mat-form-field style="width: 40%">
              <textarea matInput placeholder="Translation" rows="1" style="resize: none" [(ngModel)]="translation"></textarea>
            </mat-form-field>
            <button mat-button class="w3-teal" (click)="addWord()">Add to dictionary</button>
          </div>
          <mat-form-field style="max-width: 500px; margin: auto">
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
            <div class="w3-col l3 m3" style="margin-top: 7px; padding-left: 5%">
              <button mat-button="" class="w3-teal" [disabled]="this.selection.isEmpty()">Learn chosen words</button>
            </div>
            <div class="w3-col l3 m3" style="margin-top: 7px;">
              <button mat-button="" class="" [disabled]="this.selection.isEmpty()" (click)="openDialog()">
                <i class="glyphicon glyphicon-trash"></i>
              </button>
            </div>
            <mat-paginator #paginator class="w3-col l6 m6"
                           [pageSize]="10"
                           [pageSizeOptions]="[1, 10, 20, 50]">
            </mat-paginator>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`.example-container {
    display: flex;
    flex-direction: column;
    min-width: 300px;
    height: auto;
  }`,
  `.mat-table {
    overflow: auto;
    max-height: 500px;
  }`,
  `.mat-column-select {
      overflow: visible;
    }`
  ]
})

export class DictionaryComponent implements OnInit, AfterViewInit {
  URL = 'http://localhost:8080/dictionary';

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

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    if(localStorage.getItem('token') === null)
      this.document.location.href = '';
    let httpOptions = {};
    if (localStorage.getItem('token') != null) {
      httpOptions = {
        headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('token')})
      };
    }
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
  addWord(): void {
    if (this.word.trim() === null || this.translation.trim() === null) return;
    let httpOptions = {};
    if (localStorage.getItem('token') != null) {
      httpOptions = {
        headers: new HttpHeaders({'Authorization' : 'Bearer ' + localStorage.getItem('token')})
      };
    }
    this.http.put(this.URL, new Card(this.word.trim().toLowerCase(), this.translation.trim().toLowerCase()), httpOptions).subscribe((data: Card[]) => {
      this.dictionary = data.map(x => Object.assign({}, x));
      this.dataSource = new MatTableDataSource<Card>(this.dictionary);
      this.dataSource.paginator = this.paginator;
    });
    this.word = null;
    this.translation = null;
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
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {confirm: this.confirmDelete}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.confirmDelete = result;
      if (this.confirmDelete === 'delete') {
        this.confirmDelete = null;
        this.deleteWords();
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



class Card {
  constructor(public word: string, public translation: string) {}
}

@Component({
  selector: 'app-dialog-confirm',
  template: `<h1 mat-dialog-title>Print \"delete\" to confirm</h1>
  <div mat-dialog-content>
    <mat-form-field>
      <input matInput [(ngModel)]="data.confirmDelete">
    </mat-form-field>
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onNoClick()">Cancel</button>
    <button mat-button [mat-dialog-close]="data.confirmDelete" cdkFocusInitial>Ok</button>
  </div>`
})
export class DialogConfirmComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
