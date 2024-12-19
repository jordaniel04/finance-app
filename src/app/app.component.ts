import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    const isDarkTheme = savedTheme ? savedTheme === 'dark' : true;
    
    if (isDarkTheme) {
      this.document.body.classList.remove('light-theme');
      this.document.body.classList.add('dark-theme');
    } else {
      this.document.body.classList.remove('dark-theme');
      this.document.body.classList.add('light-theme');
    }
  }
}
