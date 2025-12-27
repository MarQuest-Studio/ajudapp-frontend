import { TestBed } from '@angular/core/testing';
import { ClickOutsideDirective } from './click-outside.directive';
import { ElementRef } from '@angular/core';

describe('ClickOutsideDirective', () => {
  let directive: ClickOutsideDirective;
  let mockElementRef: jasmine.SpyObj<ElementRef>;
  beforeEach(async () => {

    mockElementRef = jasmine.createSpyObj('ElementRef', [], ['nativeElement']);
    mockElementRef.nativeElement = document.createElement('div');
    await TestBed.configureTestingModule({
      providers: [{ provide: ElementRef, useValue: mockElementRef }]
    }).compileComponents();

    TestBed.runInInjectionContext(() => {
      directive = new ClickOutsideDirective();
    });
  });
  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
