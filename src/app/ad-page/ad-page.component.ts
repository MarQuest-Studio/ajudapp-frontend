import { Component } from '@angular/core';
import { MapComponent } from "../shared/map/map.component";
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-ad-page',
  imports: [MapComponent, CommonModule, TranslateModule],
  templateUrl: './ad-page.component.html',
  styleUrl: './ad-page.component.scss',
})
export class AdPageComponent {

}
