import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';

import { AdListComponent } from './ad-list.component';

describe('AdListComponent', () => {
  let component: AdListComponent;
  let fixture: ComponentFixture<AdListComponent>;
  let mockStore: { select: jasmine.Spy; dispatch: jasmine.Spy };

  beforeEach(async () => {
    mockStore = {
      select: jasmine.createSpy('select').and.returnValue(of([])),
      dispatch: jasmine.createSpy('dispatch')
    } as any;

    await TestBed.configureTestingModule({
      imports: [AdListComponent],
      providers: [{ provide: Store, useValue: mockStore }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
