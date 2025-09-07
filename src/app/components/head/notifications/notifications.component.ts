import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MoradorService } from '../../../services/morador/morador.service';

interface Pagamento {
  id: number;
  moradorId: number;
  dataVencimento: string;
  dataPagamento: string;
  valor: number;
  Moradore: {
    nome: string;
    Unidade: {
      numeroUnidade: number;
    };
  };
}

@Component({
  selector: 'app-notifications',
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent {
  constructor(private moradorService: MoradorService) {}
  @Input() vencimentosProximos: any[] = [];
  @Input() diasAviso: number | null = null;
  @Output() fechar = new EventEmitter<number>();

  removerNotificacao(index: number) {
    this.fechar.emit(index);
  }
}
