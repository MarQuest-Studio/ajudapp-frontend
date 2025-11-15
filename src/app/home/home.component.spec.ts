import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { HomeComponent } from './home.component';
import { loadRegions } from '../state/regions/regions.actions';

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
      imports: [HomeComponent],
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
});

