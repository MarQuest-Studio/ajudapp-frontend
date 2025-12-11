import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectDistricts } from '../state/regions/regions.selector';
import { loadRegions, searchRegions } from '../state/regions/regions.actions';
import { DropdownFilterComponent } from "../shared/dropdown-filter/dropdown-filter.component";
import { RegionHit } from '../core/services/regions.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, DropdownFilterComponent],
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

  onDistrictSelected($event: RegionHit) {
    console.log($event);
  }

  onLocationSearch(searchTerm: string) {
    console.log('Searching for:', searchTerm);
    this.store.dispatch(searchRegions({query: searchTerm}));
  }

  getLabel(hit: RegionHit): string {
    switch (hit.kind) {
      case 'district':
        return hit.district;
      case 'city':
        return `${hit.city}, ${hit.district}`;
      case 'parish':
        return `${hit.parish}, ${hit.city}, ${hit.district}`;
      default:
        return hit.district;
    }
  }

  getHitKind(hit: RegionHit): string {
    switch (hit.kind) {
      case 'district':
        return 'Distrito';
      case 'city':
        return 'Concelho';
      case 'parish':
        return 'Freguesia';
      default:
        return hit.district;
    }
  }
}
