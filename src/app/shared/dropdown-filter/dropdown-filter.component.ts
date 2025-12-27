import { CommonModule } from '@angular/common';
import { Component, ContentChild, ElementRef, Input, OnInit, output, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import * as bootstrap from 'bootstrap';
import { ClickOutsideDirective } from "../../core/directives/click-outside.directive";

@Component({
  selector: 'app-dropdown-filter',
  templateUrl: './dropdown-filter.component.html',
  styleUrls: ['./dropdown-filter.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ClickOutsideDirective]
})
export class DropdownFilterComponent<T> implements OnInit {
  
  @ViewChild('toggleBtn') toggleBtn!: ElementRef;

  selectedItem: T | null = null;
  searchTerm = '';
  searchChanged = new Subject<string>();

  @Input()
  items: T[] = [];

  @Input()
  placeholder = '';

  @Input()
  itemKeyField = '';

  @Input()
  itemDescriptionField: string | undefined;

  @Input()
  itemDescription: string | undefined;
  
  @ContentChild(TemplateRef) optionTemplate!: TemplateRef<unknown>;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  @Input()
  icon = '';

  searchEvent = output<string>();
  selectedEvent = output<T>();
  isTyping = false;

  ngOnInit(): void {
    this.searchChanged
      .pipe(
        debounceTime(300)
      )
      .subscribe(term => {
        this.searchEvent.emit(term);
        const dropdown = new bootstrap.Dropdown(this.toggleBtn.nativeElement);
        dropdown.show();
      });
  }

  onSearch() {
    this.searchChanged.next(this.searchTerm);
  }

  select(item: T) {
    this.selectedItem = item;
    this.selectedEvent.emit(item);
    this.stopTyping();
  }

  clear(event: MouseEvent) {
    event.stopPropagation();
    this.selectedItem = null;
    this.searchTerm = '';
    this.onSearch();
  }

  startTyping() {;
    this.searchTerm = '';
    this.isTyping = true;
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
      const dropdown = new bootstrap.Dropdown(this.toggleBtn.nativeElement);
      dropdown.show();
    });
  }

  stopTyping() {
    this.isTyping = false;
  }
}
