import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectDistricts } from '../state/regions/regions.selector';
import { loadRegions } from '../state/regions/regions.actions';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
})
export class HomeComponent implements OnInit {
  
  readonly store = inject(Store);

  districts$ = this.store.select(selectDistricts);

  ngOnInit(): void {
    this.districts$.subscribe(districts => {
      console.log(districts);
    });
    this.store.dispatch(loadRegions());
  }
}
