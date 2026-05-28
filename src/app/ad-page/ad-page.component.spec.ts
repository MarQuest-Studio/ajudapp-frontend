import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateNoOpLoader } from '@ngx-translate/core';

import { AdPageComponent } from './ad-page.component';

describe('AdPageComponent', () => {
  let component: AdPageComponent;
  let fixture: ComponentFixture<AdPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdPageComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateNoOpLoader }
        })
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
