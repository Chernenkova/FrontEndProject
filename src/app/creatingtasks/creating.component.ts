import {Component, Input} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from "@angular/router";

@Component(
  {
    selector: 'app-creating-comp',
    templateUrl: './creating.component.html',
    styleUrls: ['./style.css']
  })


export class CreatingComponent {
  BASIC_TYPE = '/create/basic';
  ADVANCED_TYPE = 'CHOOSING_WITH_TRANSLATION';
  POST_URL = 'http://localhost:8080/choosing-translation/';
  taskMode: number;
  word: string = null;
  translation: string = null;
  basicTaskArray: Card[] = [];
  advancedTaskArray: CardWithTranslations[] = [];
  translation1: string = null;
  translation2: string = null;
  translation3: string = null;
  @Input() router: Router;
  constructor(private http: HttpClient) {
  }

  addWord() {
    console.log("add");
    if (this.taskMode === 0) {
      if (this.word === null || this.translation === null) return;
      this.basicTaskArray.push(new Card(this.word, this.translation));
    }
    if (this.taskMode === 1) {
      if (this.word === null ||
          this.translation === null ||
          this.translation1 === null ||
          this.translation2 === null ||
          this.translation3 === null) return;
      this.advancedTaskArray.push(new CardWithTranslations(this.word,
                                  [this.translation, this.translation1, this.translation2, this.translation3]));
    }

    this.word = null;
    this.translation = null;
    this.translation1 = null;
    this.translation2 = null;
    this.translation3 = null;
  }

  removeWord(id: number) {
    if (this.taskMode === 0) {
      this.basicTaskArray.splice(id, 1);
    }else if (this.taskMode === 1) {
      this.advancedTaskArray.splice(id, 1);
    }
  }

  submit() {
    console.log("submit");
    if (this.taskMode === 0) {
      // basic task
      const task = new BasicTask(this.basicTaskArray);
      this.http.post(this.POST_URL + this.BASIC_TYPE, task).subscribe();
      this.basicTaskArray.splice(0);
    } else if (this.taskMode === 1) {
      // advanced task
      const task = new AdvancedTask(this.advancedTaskArray);
      this.http.post(this.POST_URL + this.BASIC_TYPE, task).subscribe();
      this.advancedTaskArray.splice(0);
    }
  }
}

export class Card {
  constructor(public word: string, public translation: string) {}
}

export class BasicTask {
  constructor(public array: Card[]) {
  }
}

export class CardWithTranslations {
  constructor(public word: string, public translations: string[]) {
  }
}

export class AdvancedTask {
  constructor(public array: CardWithTranslations[]) {
  }
}
