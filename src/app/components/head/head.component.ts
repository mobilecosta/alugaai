import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { NotificationsComponent } from './notifications/notifications.component';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { MoradorService } from '../../services/morador/morador.service';

interface Notificacao {
  id: number;
  nome: string;
  dias?: number;
  tipo: string;
}

@Component({
  selector: 'app-head',
  standalone: true,
  imports: [CommonModule, MenuComponent, NotificationsComponent],
  templateUrl: './head.component.html',
  styleUrl: './head.component.scss',
  animations: [
    trigger('menuAnimacao', [
      state(
        'aberto',
        style({ opacity: 1, transform: 'translateX(0)', pointerEvents: 'auto' })
      ),
      state(
        'fechado',
        style({
          opacity: 0,
          transform: 'translateX(-100%)',
          pointerEvents: 'none',
        })
      ),
      transition('aberto <=> fechado', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class HeadComponent implements OnInit {
  diasAviso: number | null = 5;
  notificacoes: Notificacao[] = [];
  totalNotificacoes: number = 0;

  @Input() titulo = 'titulo';
  @Input() mostrarBotaoVoltar = true;
  @Input() mostrarMenu = true;
  @Output() voltar = new EventEmitter<void>();

  menuOpen = false;
  notificationOpen = false;

  constructor(private moradorService: MoradorService) {}

  ngOnInit(): void {
    this.filtrarVencimentos();
    this.buscarContratos();
  }

  buscarContratos() {
    this.moradorService.listarImoveis().subscribe({
      next: (data: any) => {
        const exibidas = JSON.parse(
          sessionStorage.getItem('notificacoesExibidas') || '[]'
        );
        const contratosProximos = data.flatMap(({ Unidades }: any) =>
          Unidades.flatMap(({ Moradores }: any) =>
            Moradores.filter(({ fimContrato, ativo, id }: any) => {
              const hoje = new Date();
              const limite = new Date();
              limite.setDate(hoje.getDate() + (this.diasAviso || 0));
              const dataFim = new Date(fimContrato);
              const chave = `Contrato-${id}`;
              return (
                ativo &&
                dataFim >= hoje &&
                dataFim <= limite &&
                !exibidas.includes(chave)
              );
            }).map(({ id, nome }: any) => ({
              id,
              nome,
              tipo: 'Contrato',
            }))
          )
        );
        this.notificacoes.push(...contratosProximos);
        this.totalNotificacoes = this.notificacoes.length;
      },
    });
  }

  filtrarVencimentos() {
    if (this.mostrarBotaoVoltar) return;
    this.moradorService.listarTodosPagamentos().subscribe({
      next: (data) => {
        if (!this.diasAviso) return;
        const exibidas = JSON.parse(
          sessionStorage.getItem('notificacoesExibidas') || '[]'
        );
        const dataAtual = new Date();
        const limite = new Date();
        limite.setDate(dataAtual.getDate() + this.diasAviso);

        const pagamentosProximos = data
          .filter((pagamento: any) => {
            const dataVencimento = new Date(pagamento.dataVencimento);
            const estaoPendente = pagamento.status == 'Pendente';
            const ativo = pagamento.Moradore.ativo === true;
            const chave = `Aluguel-${pagamento.id}`;
            return (
              ativo &&
              estaoPendente &&
              dataVencimento >= dataAtual &&
              dataVencimento <= limite &&
              !exibidas.includes(chave)
            );
          })
          .map((pagamento: any) => ({
            id: pagamento.id,
            nome: pagamento.Moradore.nome,
            tipo: 'Aluguel',
          }));

        this.notificacoes.push(...pagamentosProximos);
        this.totalNotificacoes = this.notificacoes.length;
      },
    });
  }

  removerNotificacao(index: number) {
    const notificacao = this.notificacoes[index];
    const exibidas = JSON.parse(
      sessionStorage.getItem('notificacoesExibidas') || '[]'
    );
    exibidas.push(`${notificacao.tipo}-${notificacao.id}`);
    sessionStorage.setItem('notificacoesExibidas', JSON.stringify(exibidas));
    this.notificacoes.splice(index, 1);
    this.totalNotificacoes = this.notificacoes.length;
  }

  emitirVoltar() {
    this.voltar.emit();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (this.notificationOpen) this.notificationOpen = false;
  }

  toggleNotification() {
    this.notificationOpen = !this.notificationOpen;
    if (this.menuOpen) this.menuOpen = false;
  }
}
