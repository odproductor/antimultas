import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.page.html',
  styleUrls: ['./faqs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class FaqsPage implements OnInit {

  question: any = {};

  constructor() {
    this.question = localStorage.getItem("question") ? JSON.parse(localStorage.getItem("question") ?? '{}') : {};
  }

  ngOnInit() {
  }

}
