import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';

import { AdListComponent } from './ad-list.component';
import { loadRegions, searchRegions } from '../state/regions/regions.actions';

describe('AdListComponent', () => {
  let component: AdListComponent;
  let fixture: ComponentFixture<AdListComponent>;
  let mockStore: { select: jasmine.Spy; dispatch: jasmine.Spy };

  beforeEach(async () => {
    mockStore = {
      select: jasmine.createSpy('select').and.returnValue(of([])),
      dispatch: jasmine.createSpy('dispatch')
    } as unknown as { select: jasmine.Spy; dispatch: jasmine.Spy };

    await TestBed.configureTestingModule({
      imports: [AdListComponent],
      providers: [{ provide: Store, useValue: mockStore }]
    }).compileComponents();

    fixture = TestBed.createComponent(AdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and dispatch loadRegions on init', () => {
    expect(component).toBeTruthy();
    expect(mockStore.dispatch).toHaveBeenCalledWith(loadRegions());
  });

  it('onLocationSearch should dispatch searchRegions', () => {
    component.onLocationSearch('porto');
    expect(mockStore.dispatch).toHaveBeenCalledWith(searchRegions({ query: 'porto' }));
  });

  it('toggleCategories toggles open state and button reflects it', () => {
    const btn = fixture.nativeElement.querySelector('button[aria-controls="categoriesCollapse"]');
    expect(component.categoriesOpen).toBeTrue();
    btn.click();
    fixture.detectChanges();
    expect(component.categoriesOpen).toBeFalse();
    btn.click();
    fixture.detectChanges();
    expect(component.categoriesOpen).toBeTrue();
  });

  it('toggleRatingsPanel toggles open state and button reflects it', () => {
    const btn = fixture.nativeElement.querySelector('button[aria-controls="ratingCollapse"]');
    expect(component.ratingsOpen).toBeTrue();
    btn.click();
    fixture.detectChanges();
    expect(component.ratingsOpen).toBeFalse();
    btn.click();
    fixture.detectChanges();
    expect(component.ratingsOpen).toBeTrue();
  });

  it('toggleCategory adds and removes category', () => {
    component.toggleCategory('Plumbing', true);
    expect(component.selectedCategories.has('Plumbing')).toBeTrue();
    component.toggleCategory('Plumbing', false);
    expect(component.selectedCategories.has('Plumbing')).toBeFalse();
  });

  it('selectRating sets the selectedRating via method and via DOM interaction', fakeAsync(() => {
    component.selectRating(4);
    expect(component.selectedRating).toBe(4);

    // simulate selecting rating via radio input in the template
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('#rating-3') as HTMLInputElement;
    expect(input).toBeDefined();
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    tick();
    fixture.detectChanges();
    expect(component.selectedRating).toBe(3);
  }));

  it('applyFilters logs current filters', () => {
    component.selectedCategories.add('Electrical');
    component.selectedRating = 5;
    spyOn(console, 'log');
    component.applyFilters();
    expect(console.log).toHaveBeenCalledWith('Applying filters', Array.from(component.selectedCategories), component.selectedRating);
  });

  it('clearFilters resets categories and rating', () => {
    component.selectedCategories.add('Cleaning');
    component.selectedRating = 4;
    spyOn(console, 'log');

    component.clearFilters();
    expect(component.selectedCategories.size).toBe(0);
    expect(component.selectedRating).toBeNull();
    expect(console.log).toHaveBeenCalledWith('Filters cleared');
  });

  it('category checkbox DOM change calls toggleCategory', fakeAsync(() => {
    fixture.detectChanges();
    const checkbox = fixture.nativeElement.querySelector('#cat-Plumbing') as HTMLInputElement;
    expect(checkbox).toBeDefined();
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    tick();
    fixture.detectChanges();
    expect(component.selectedCategories.has('Plumbing')).toBeTrue();
  }));
});
