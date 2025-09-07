import { Component, input, Input, OnInit } from '@angular/core';
import { HeadComponent } from '../../components/head/head.component';
import { CommonModule, Location } from '@angular/common';
import { MoradorService } from '../../services/morador/morador.service';
import { RouterModule } from '@angular/router';

interface Unidade {
  valorAluguel: number;
}

interface Pagamento {
  id?: Number;
  moradorId: number;
  dataVencimento: string;
  dataPagamento: string;
  valor: number;
}

@Component({
  selector: 'app-estatisticas',
  imports: [HeadComponent, CommonModule, RouterModule],
  templateUrl: './estatisticas.component.html',
  styleUrl: './estatisticas.component.scss',
})
export class EstatisticasComponent implements OnInit {
  unidades = [];
  alugadas: Unidade[] = [];
  vazias: Unidade[] = [];
  pagamentos = [];
  pagamentosMesAtual = [];
  totalUnidades = this.unidades.length;
  totalAlugadas: number | null = null;
  valorRecebido: number | null = null;
  totalVazias: number | null = null;
  total: number | null = null;
  mesAtual = new Date().getMonth;
  mesAtualTexto = new Date().toLocaleDateString('pt-BR', { month: 'long' });

  loading: boolean = false;

  constructor(
    private location: Location,
    private moradorService: MoradorService
  ) {}

  listarPagamentos() {
    if (!this.pagamentosMesAtual) return;
    this.moradorService.listarTodosPagamentos().subscribe({
      next: (data) => {
        console.log(data);
        this.pagamentos = data.filter(
          (pagamento: any) => pagamento.status == 'Pago'
        );
        this.pagamentosMesAtual = this.pagamentos.filter(
          (pagamento: any) =>
            new Date(pagamento.dataPagamento).getMonth == this.mesAtual
        );
        this.valorRecebido = this.pagamentosMesAtual.reduce(
          (total, pagamento: any) => total + pagamento.valor,
          0
        );
      },
    });
  }

  ngOnInit(): void {
    this.loading = true;

    this.listarPagamentos();

    this.moradorService.listarImoveis().subscribe({
      next: (data) => {
        this.unidades = data.map((imovel: any) => imovel.Unidades).flat();
        this.totalUnidades = this.unidades.length;

        this.alugadas = this.unidades.filter(
          (unidade: any) => unidade.ocupada == true
        );

        this.vazias = this.unidades.filter(
          (unidade: any) => unidade.ocupada == false
        );

        this.totalAlugadas = this.alugadas.reduce(
          (total, unidade) => total + unidade.valorAluguel,
          0
        );

        this.totalVazias = this.vazias.reduce(
          (total, unidade) => total + unidade.valorAluguel,
          0
        );

        this.total = this.totalAlugadas + this.totalVazias;

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  voltar() {
    this.location.back();
  }
}
