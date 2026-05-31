import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { AppTranslateService } from './core/services/translate.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
})
export class AppComponent implements OnInit {

  translateService = inject(AppTranslateService);

  ngOnInit(): void {
    this.translateService.initializeLanguage();  
  }

  title = 'ajudapp';
}
