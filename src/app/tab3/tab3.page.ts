import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class Tab3Page {

  questionList: any = [];

  constructor(
    private nav: NavController
  ) {
    this.questionList =  localStorage.getItem("faqs") ? JSON.parse(localStorage.getItem("faqs") ?? '[]') : [];
  }

  showAnswer(question: any) {
    localStorage.setItem("question", JSON.stringify(question));
    this.nav.navigateForward(`/faqs`);
  }
    
}
