import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-botao-cancelar',
  standalone: true,
  imports: [],
  templateUrl: './botao-cancelar.component.html',
  styleUrl: './botao-cancelar.component.scss',
})
export class BotaoCancelarComponent {
  @Output() cancelar = new EventEmitter<void>();

  cliqueCancelar() {
    this.cancelar.emit();
  }
}
