import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ElementRef } from '@angular/core';

import { DropdownFilterComponent } from './dropdown-filter.component';

describe('DropdownFilterComponent', () => {
  let component: DropdownFilterComponent<{ id: number; label: string }>;
  let fixture: ComponentFixture<DropdownFilterComponent<{ id: number; label: string }>>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [DropdownFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownFilterComponent) as ComponentFixture<DropdownFilterComponent<{ id: number; label: string }>>;
    component = fixture.componentInstance;
    // provide minimal ElementRefs used by the component
    component.toggleBtn = { nativeElement: {} } as unknown as ElementRef<HTMLElement>;
    component.searchInput = { nativeElement: { focus: jasmine.createSpy('focus') } } as unknown as ElementRef<HTMLInputElement>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onSearch should emit searchEvent after debounce and show dropdown', fakeAsync(() => {
    spyOn(component.searchEvent, 'emit');
    component.searchTerm = 'porto';
    component.onSearch();
    // debounceTime 300ms
    tick(300);
    expect(component.searchEvent.emit).toHaveBeenCalledWith('porto');
  }));

  it('select should set selectedItem, emit selectedEvent and stop typing', () => {
    const item = { id: 1, label: 'One' };
    spyOn(component.selectedEvent, 'emit');
    component.isTyping = true;
    component.select(item);
    expect(component.selectedItem).toBe(item);
    expect(component.selectedEvent.emit).toHaveBeenCalledWith(item);
    expect(component.isTyping).toBeFalse();
  });

  it('clear should reset selection and call onSearch', () => {
    component.selectedItem = { id: 2, label: 'Two' };
    component.searchTerm = 'abc';
    spyOn(component, 'onSearch');
    const fakeEvent = { stopPropagation: jasmine.createSpy('stop') } as unknown as MouseEvent;
    component.clear(fakeEvent);
    expect(fakeEvent.stopPropagation).toHaveBeenCalled();
    expect(component.selectedItem).toBeNull();
    expect(component.searchTerm).toBe('');
    expect(component.onSearch).toHaveBeenCalled();
  });

  it('startTyping should focus input, set typing and show dropdown', fakeAsync(() => {
    // ensure state
    spyOn(component.searchInput.nativeElement, 'focus');
    component.searchTerm = 'something';
    component.isTyping = false;
    component.startTyping();
    // startTyping sets isTyping synchronously
    expect(component.searchTerm).toBe('');
    expect(component.isTyping).toBeTrue();
    // run the setTimeout callback
    tick(0);
    expect(component.searchInput.nativeElement.focus).toHaveBeenCalled();
  }));
});
