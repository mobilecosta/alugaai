import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-botao-adicionar',
  imports: [],
  standalone: true,
  templateUrl: './botao-adicionar.component.html',
  styleUrl: './botao-adicionar.component.scss',
})
export class BotaoAdicionarComponent {
  @Input() texto = 'Adicionar';
  @Input() icone = 'icone';
  @Output() clicado = new EventEmitter<Event>();
}
