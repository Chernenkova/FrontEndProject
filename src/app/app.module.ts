import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { AppComponent } from './app.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {CardComponent} from './tasks/cards/card.component';
import {CreatingComponent} from './creatingtasks/creating.component';
import {QuestionViewComponent} from './questions/question_view_component';
import {CreatingQuestionComponent} from './questions/creating_question_component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {DialogConfirmComponent, DictionaryComponent} from './tasks/dictionary_component';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CdkTableModule} from '@angular/cdk/table';
import {CabinetComponent} from './welcome/cabinet.component';
import {SettingsComponent} from './settings/settings.component';
import {UpdateUserComponent} from './settings/update.user.component';
import {TaskListComponent} from './welcome/task_list_component';
import {AdminHelloComponent} from './admin/admin.hello.component';
import {AddWordComponent} from './admin/add.word.component';
import {AdminAddNewGroupComponent, DialogCreateTaskComponent} from './admin/admin.add.new.group.component';
import {DialogPasswordWarningComponent, RecoverPasswordComponent} from './settings/recover.password.component';
import {RequestRecoverPasswordComponent} from './settings/request.recover.password.component';
import {DialogWarningEmailComponent, WelcomeSignUpComponent} from './welcome/welcome.sign.up.component';
import {ConfirmRegistrationComponent, DialogWarningComponent} from './registration/confirm.registration.component';
import {LearnWritingComponent} from './tasks/learn.writing.component';
import {TaskEngRusComponent} from './admin/tasks/task.Eng.Rus.component';
import {Task1from4Component} from './admin/tasks/task.1from4.component';
import {TaskTextComponent} from './admin/tasks/task.text.component';
import {TaskRusEngComponent} from './admin/tasks/task.Rus.Eng.component';
import {TaskGrammarComponent} from './admin/tasks/task.grammar.component';
import {TaskVideoComponent} from './admin/tasks/task.video.component';
import {VideoViewComponent} from './questions/video.view.component';
import {SafePipe} from './questions/safe.pipe';

const appRoutes: Routes = [
  { path: '', component: WelcomeComponent},
  { path: 'questions', component: CreatingQuestionComponent},
  { path: 'view/:id', component: QuestionViewComponent },
  { path: 'card/:id', component: CardComponent},
  { path: 'videoView/:id', component: VideoViewComponent },
  { path: 'dictionary', component: DictionaryComponent},
  { path: 'cabinet', component: CabinetComponent},
  { path: 'signUp', component: WelcomeSignUpComponent},
  { path: 'settings', component: SettingsComponent},
  { path: 'updateUser', component: UpdateUserComponent},
  { path: 'admin', component: AdminHelloComponent},
  { path: 'admin/addNewWords', component: AddWordComponent},
  { path: 'admin/addNewGroups', component: AdminAddNewGroupComponent},
  { path: 'admin/addNewEngRus', component: TaskEngRusComponent},
  { path: 'admin/addNewRusEng', component: TaskRusEngComponent},
  { path: 'admin/addNewText', component: TaskTextComponent},
  { path: 'admin/addNew1from4', component: Task1from4Component},
  { path: 'admin/addNewVideo', component: TaskVideoComponent},
  { path: 'admin/addNewGrammar', component: TaskGrammarComponent},
  { path: 'recover-request', component: RequestRecoverPasswordComponent},
  { path: 'recover/:id', component: RecoverPasswordComponent},
  { path: 'confirm-registration/:id', component: ConfirmRegistrationComponent},
  { path: 'learn-writing/:id', component: LearnWritingComponent},
  { path: '**', redirectTo: '/'}
];

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    CardComponent,
    CreatingComponent,
    QuestionViewComponent,
    CreatingQuestionComponent,
    DictionaryComponent,
    DialogConfirmComponent,
    CabinetComponent,
    SettingsComponent,
    UpdateUserComponent,
    TaskListComponent,
    AdminHelloComponent,
    AddWordComponent,
    AdminAddNewGroupComponent,
    RecoverPasswordComponent,
    RequestRecoverPasswordComponent,
    DialogPasswordWarningComponent,
    WelcomeSignUpComponent,
    ConfirmRegistrationComponent,
    DialogWarningComponent,
    DialogWarningEmailComponent,
    LearnWritingComponent,
    TaskEngRusComponent,
    TaskRusEngComponent,
    Task1from4Component,
    TaskTextComponent,
    TaskVideoComponent,
    TaskGrammarComponent,
    VideoViewComponent,
    SafePipe,
    DialogCreateTaskComponent
  ],
  entryComponents: [
    DialogConfirmComponent,
    DictionaryComponent,
    DialogPasswordWarningComponent,
    DialogWarningComponent,
    DialogWarningEmailComponent,
    DialogCreateTaskComponent
  ],
  imports: [
    BrowserModule, FormsModule, HttpClientModule, RouterModule.forRoot(appRoutes),
    MatTableModule, MatPaginatorModule, MatCheckboxModule, BrowserAnimationsModule,
    CdkTableModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
