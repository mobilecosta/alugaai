import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeadComponent } from '../../components/head/head.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { MoradorService } from '../../services/morador/morador.service';

interface Pagamento {
  dataPagamento: string | null;
  dataVencimento: string;
  status: string;
  valor: number | null;
  id: number | null;
}

@Component({
  selector: 'app-tabela-pagamentos',
  imports: [CommonModule, HeadComponent, ModalComponent],
  templateUrl: './tabela-pagamentos.component.html',
  styleUrls: ['./tabela-pagamentos.component.scss'],
})
export class TabelaPagamentosComponent implements OnInit {
  moradorId: number | null = null;
  moradorNome: string = '';
  moradorTelefone: string = '';

  valor: number | null = null;
  dataVencimento: string = '';
  pagamentoId: number | null = null;
  historicoPagamentos: Pagamento[] = [];
  pagamentoFiltrado: Pagamento[] = [];

  anoAtual = new Date().getFullYear();
  anoInicioContrato: number | null = null;
  intervaloAnos: number[] = [];

  pagamentoSelecionado: Pagamento | null = null;
  mensagemModal: string = '';
  tituloModal: string = '';
  mostrarModal: boolean = false;
  loading: boolean = false;

  constructor(
    private moradorService: MoradorService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['moradorId'];
      this.moradorId = Number(id);
      if (!this.moradorId) return;

      this.buscarDadosMorador();
      this.buscarHistoricoPagamentos();
    });
  }

  private buscarDadosMorador() {
    if (!this.moradorId) return;

    this.moradorService.buscarMoradorporId(this.moradorId).subscribe({
      next: (data) => {
        this.moradorNome = data.nome;
        this.moradorTelefone = data.telefone;
      },
      error: (err) => console.error(err),
    });
  }

  private buscarHistoricoPagamentos() {
    if (!this.moradorId) return;

    this.moradorService.listarPagamentos(this.moradorId).subscribe({
      next: (data: Pagamento[]) => {
        this.historicoPagamentos = data;

        if (this.historicoPagamentos.length === 0) {
          this.pagamentoFiltrado = [];
          this.intervaloAnos = [];
          return;
        }

        this.historicoPagamentos.map((pagamento) => {
          this.valor = pagamento.valor;
          this.pagamentoId = pagamento.id;
          this.dataVencimento = new Date(
            pagamento.dataVencimento
          ).toLocaleDateString('pt-BR');
        });

        const anos = this.historicoPagamentos.map((pag) =>
          new Date(pag.dataVencimento).getFullYear()
        );

        this.anoInicioContrato = Math.min(...anos);
        this.gerarIntervaloAnos();

        this.pagamentoFiltrado = this.historicoPagamentos.filter((pag) =>
          pag.dataVencimento.includes(this.anoAtual.toString())
        );
      },
    });
  }

  filtrar(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const anoSelecionado = selectElement.value;

    this.pagamentoFiltrado = this.historicoPagamentos.filter((pagamento) =>
      pagamento.dataVencimento.includes(anoSelecionado)
    );
  }

  gerarIntervaloAnos() {
    this.intervaloAnos = [];
    if (this.anoInicioContrato === null) return;

    for (let ano = this.anoInicioContrato; ano <= this.anoAtual; ano++) {
      this.intervaloAnos.push(ano);
    }
  }

  formatarData(datastr: string): Date {
    const [dia, mes, ano] = datastr.split('/');
    return new Date(+ano, +mes - 1, +dia);
  }

  registrarPagamento(pagamento: Pagamento) {
    if (!pagamento || !this.moradorId) return;

    this.loading = true;

    const dados = {
      id: pagamento.id,
      moradorId: this.moradorId,
      valor: pagamento.valor,
      status: 'Pago',
      dataPagamento: new Date().toISOString().slice(0, 10),
      dataVencimento: new Date(pagamento.dataVencimento)
        .toISOString()
        .slice(0, 10),
    };

    this.moradorService.registrarPagamento(dados).subscribe({
      next: (data) => {
        this.mensagemModal = data.message;
        this.mostrarModal = true;
      },
      error: (err) => {
        this.mensagemModal = err.error.message;
        this.mostrarModal = true;
      },
    });
  }

  ligar() {
    this.router.navigate([
      `https://wa.me/${this.moradorTelefone}?text="Olá ${this.moradorNome}, vi que o pagamento do dia ${this.dataVencimento} está atrasado, regularize por favor`,
    ]);
  }

  voltar() {
    this.location.back();
  }

  fecharModal() {
    if (this.mensagemModal === 'Pagamento registrado com sucesso!') {
      this.mostrarModal = false;
      window.location.reload();
      return;
    }
    this.mostrarModal = false;
  }
}
