import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';
import { HomeComponent } from './home.component';
import { loadRegions, searchRegions } from '../state/regions/regions.actions';
import { RegionHit } from '../core/services/regions.service';

describe('HomeComponent', () => {
  let mockStore: { select: jasmine.Spy; dispatch: jasmine.Spy };
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {

    mockStore = {
      select: jasmine.createSpy('select').and.returnValue(of(null)),
      dispatch: jasmine.createSpy('dispatch')
    };

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader }
        })
      ],
      providers: [{ provide: Store, useValue: mockStore }]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select districts and dispatch loadRegions on init', () => {
    component.ngOnInit();

    expect(mockStore.select).toHaveBeenCalled();
    expect(mockStore.dispatch).toHaveBeenCalledWith(loadRegions());
  });

  it('onDistrictSelected should log the event', () => {
    const hit: RegionHit = { kind: 'district', district: 'Lisboa', score: 0 };
    spyOn(console, 'log');
    component.onDistrictSelected(hit);
    expect(console.log).toHaveBeenCalledWith(hit);
  });

  it('onLocationSearch should dispatch searchRegions with query', () => {
    component.onLocationSearch('porto');
    expect(mockStore.dispatch).toHaveBeenCalledWith(searchRegions({ query: 'porto' }));
  });

  it('getLabel returns district label', () => {
    const hit: RegionHit = { kind: 'district', district: 'Braga', score: 0 };
    expect(component.RegionsService.getLabel(hit)).toBe('Braga');
  });

  it('getLabel returns city label', () => {
    const hit: RegionHit = { kind: 'city', city: 'Faro', district: 'Faro', score: 0 };
    expect(component.RegionsService.getLabel(hit)).toBe('Faro, Faro');
  });

  it('getLabel returns parish label', () => {
    const hit: RegionHit = { kind: 'parish', parish: 'Sé', city: 'Coimbra', district: 'Coimbra', score: 0 };
    expect(component.RegionsService.getLabel(hit)).toBe('Sé, Coimbra, Coimbra');
  });

  it('getHitKind returns localized kinds', () => {
    expect(component.RegionsService.getHitKind({ kind: 'district', district: 'X', score: 0 })).toBe('Distrito');
    expect(component.RegionsService.getHitKind({ kind: 'city', district: 'X', score: 0 })).toBe('Concelho');
    expect(component.RegionsService.getHitKind({ kind: 'parish', district: 'X', score: 0 })).toBe('Freguesia');
  });
});

