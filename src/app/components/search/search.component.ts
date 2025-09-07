import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  @Input() placeText = 'Texto do placeholder';
  @Output() searchChange = new EventEmitter<string>();

  onInputChange(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.searchChange.emit(valor);
  }
}
