import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DropdownFilterComponent } from '../shared/dropdown-filter/dropdown-filter.component';
import { RegionHit, RegionsService } from '../core/services/regions.service';
import { Store } from '@ngrx/store';
import { selectDistricts } from '../state/regions/regions.selector';
import { loadRegions, searchRegions } from '../state/regions/regions.actions';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-ad-list',
  imports: [CommonModule, DropdownFilterComponent, RouterLink, TranslateModule],
  templateUrl: './ad-list.component.html',
  styleUrls: ['./ad-list.component.scss'],
  standalone: true,
})
export class AdListComponent implements OnInit {

  ngOnInit(): void {
    this.store.dispatch(loadRegions());
  }
  categories = ['plumbing', 'electrical', 'carpentry', 'cleaning'];
  selectedCategories = new Set<string>();
  // single rating selection (radio buttons)
  selectedRating: number | null = null;

  // collapse state for filter panels
  categoriesOpen = true;
  ratingsOpen = true;

  // rating options for the rating panel
  ratingOptions = [5, 4, 3, 2, 1];

  readonly store = inject(Store);

  districts$ = this.store.select(selectDistricts);
  RegionsService = RegionsService;

  onLocationSearch(term: string) {
    console.log('Searching for:', term);
    this.store.dispatch(searchRegions({query: term}));
  }
  
  onDistrictSelected($event: RegionHit) {
    console.log($event);
  }

  toggleCategories() {
    this.categoriesOpen = !this.categoriesOpen;
  }

  toggleRatingsPanel() {
    this.ratingsOpen = !this.ratingsOpen;
  }

  toggleCategory(category: string, checked: boolean) {
    if (checked) {
      this.selectedCategories.add(category);
    } else {
      this.selectedCategories.delete(category);
    }
  }

  selectRating(rating: number) {
    this.selectedRating = rating;
  }

  applyFilters() {
    // Replace with real filtering, dispatch or event
    console.log('Applying filters', Array.from(this.selectedCategories), this.selectedRating);
  }

  clearFilters() {
    this.selectedCategories.clear();
    this.selectedRating = null;
    // clear checkbox/radio states in the DOM is left to the template
    console.log('Filters cleared');
  }
}
