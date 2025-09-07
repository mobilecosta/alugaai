import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-botao-login',
  imports: [],
  templateUrl: './botao-login.component.html',
  styleUrl: './botao-login.component.scss',
})
export class BotaoLoginComponent {
  @Input() texto = 'Botao';
  @Input() loading = false;
  @Output() clickBotao = new EventEmitter<Event>();
}
