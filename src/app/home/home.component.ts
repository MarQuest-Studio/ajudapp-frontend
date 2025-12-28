import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectDistricts } from '../state/regions/regions.selector';
import { loadRegions, searchRegions } from '../state/regions/regions.actions';
import { DropdownFilterComponent } from "../shared/dropdown-filter/dropdown-filter.component";
import { RegionHit, RegionsService } from '../core/services/regions.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [CommonModule, DropdownFilterComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
})
export class HomeComponent implements OnInit {
  
  readonly store = inject(Store);
  RegionsService = RegionsService;

  districts$ = this.store.select(selectDistricts);

  ngOnInit(): void {
    this.store.dispatch(loadRegions());
  }

  onDistrictSelected($event: RegionHit) {
    console.log($event);
  }

  onLocationSearch(searchTerm: string) {
    console.log('Searching for:', searchTerm);
    this.store.dispatch(searchRegions({query: searchTerm}));
  }
}
