import { Component, OnInit } from '@angular/core';
import { HeadComponent } from '../../components/head/head.component';
import { BotaoLoginComponent } from '../../components/botao-login/botao-login.component';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ModalComponent } from '../../components/modal/modal.component';
import { MoradorService } from '../../services/morador/morador.service';
import { Route, Router, RouterLink } from '@angular/router';
import { BotaoCancelarComponent } from '../../components/botao-cancelar/botao-cancelar.component';

interface Imovel {
  nomePredio: string;
  id: number;
}

interface Unidade {
  id: number;
  unidadeId: number;
  numeroUnidade: number;
  ocupada: boolean;
  valorAluguel: number;
}

interface Pagamento {
  id: number;
  pagamentoId: number;
  dataVencimento: string;
  status: string;
}

@Component({
  selector: 'app-registrar-pagamento',
  imports: [
    CommonModule,
    FormsModule,
    HeadComponent,
    BotaoLoginComponent,
    ModalComponent,
    RouterLink,
    BotaoCancelarComponent,
  ],
  templateUrl: './registrar-pagamento.component.html',
  styleUrl: './registrar-pagamento.component.scss',
})
export class RegistrarPagamentoComponent implements OnInit {
  imovelId: number | null = null;
  unidadeId: number | null = null;
  moradorId: number | null = null;
  pagamentoId: number | null = null;
  moradorNome: string = '';
  dataVencimento: string | null = null;
  dataPagamento: string | null = null;
  valorAluguel: number | null = null;
  valor: number | null = null;
  status: string = 'Pendente';

  modalMensagem: string = '';
  tituloModal: string = '';
  mostrarModal: boolean = false;
  loading: boolean = false;

  imoveis: Imovel[] = [];
  unidades: Unidade[] = [];
  pagamentos: Pagamento[] = [];

  constructor(private router: Router, private moradorService: MoradorService) {}

  ngOnInit(): void {
    this.loading = true;
    this.buscarImoveis();
  }

  buscarImoveis() {
    this.moradorService.listarImoveis().subscribe({
      next: (data) => {
        this.imoveis = data
          .map((imovel: Imovel) => ({
            nomePredio: imovel.nomePredio,
            id: imovel.id,
          }))
          .sort((a: any, b: any) => a.nomePredio.localeCompare(b.nomePredio));
        this.loading = false;
      },
      error: (err) => console.error(err),
    });
  }

  buscarunidades() {
    this.loading = true;
    if (!this.imovelId) return;
    this.moradorService.listarUnidades(this.imovelId).subscribe({
      next: (data) => {
        this.unidades = data
          .filter((unidade: Unidade) => unidade.ocupada == true)
          .sort();
        this.loading = false;
      },
      error: (err) => {
        this.modalMensagem = err.error.message;
        this.mostrarModal = true;
        console.error(err);
        this.loading == false;
      },
    });
  }

  buscarPagamentos() {
    if (!this.moradorId) return;

    this.moradorService.listarPagamentos(this.moradorId).subscribe({
      next: (data) => {
        this.pagamentos = data
          .filter((pagamento: Pagamento) => pagamento.status === 'Pendente')
          .map((pagamento: Pagamento) => ({
            id: pagamento.id,
            status: pagamento.status,
            pagamentoId: pagamento.id,
            dataVencimento: new Date(pagamento.dataVencimento)
              .toISOString()
              .slice(0, 10),
          }));
      },
    });
  }

  selecionarPagamento() {
    const pagamentoSelecionado = this.pagamentos.find(
      (pagamento) => pagamento.id == this.pagamentoId
    );

    if (pagamentoSelecionado) {
      this.dataVencimento = pagamentoSelecionado.dataVencimento;
    } else {
      return;
    }
  }

  formatarData(dateStr: string): Date {
    const [dia, mes, ano] = dateStr.split('/');
    return new Date(+dia, +mes - 1, +ano);
  }

  buscarMorador() {
    this.loading = true;
    if (!this.unidadeId || !this.imovelId) return;

    const unidadeSelecionada = this.unidades.find(
      (u) => u.id === Number(this.unidadeId)
    );

    if (unidadeSelecionada) {
      this.valorAluguel = unidadeSelecionada.valorAluguel;
      this.valor = this.valorAluguel;
    }

    this.moradorService.listarMorador(this.unidadeId, this.imovelId).subscribe({
      next: (data) => {
        this.moradorId = data.id;
        this.moradorNome = data.nome;
        this.buscarPagamentos();
        this.loading = false;
      },
      error: (err) => console.error(err),
    });
  }

  registrarPagamento(form: NgForm) {
    const dados = {
      pagamentoId: this.pagamentoId,
      moradorId: this.moradorId,
      dataVencimento: this.dataVencimento
        ? new Date(this.dataVencimento).toISOString().slice(0, 10)
        : '',
      dataPagamento: this.dataPagamento
        ? new Date(this.dataPagamento).toISOString().slice(0, 10)
        : '',
      valor: this.valor,
      status: 'Pago',
    };

    this.moradorService.registrarPagamento(dados).subscribe({
      next: (data: any) => {
        this.modalMensagem = data.message;
        this.tituloModal = data.titulo;
        this.mostrarModal = true;
      },
      error: (err) => {
        this.modalMensagem = err.error.message;
        this.tituloModal = 'Erro:';
        this.mostrarModal = true;
        this.loading = false;
      },
    });
  }

  fecharModal() {
    if (this.modalMensagem == 'Esse imóvel não possui unidades cadastradas!') {
      this.mostrarModal = false;
      this.imovelId = null;
    } else if (this.modalMensagem == 'Pagamento registrado com sucesso!') {
      this.imovelId = null;
      this.moradorId = null;
      this.unidadeId = null;
      this.pagamentoId = null;
      this.valorAluguel = null;
      this.dataPagamento = null;
      this.valor = null;
      this.mostrarModal = false;
    }
    this.mostrarModal = false;
    this.loading = false;
  }

  cancelar() {
    this.imovelId = null;
    this.unidadeId = null;
    this.unidades = [];
    this.moradorId = null;
    this.pagamentoId = null;
    this.dataPagamento = null;
    this.dataVencimento = null;
    this.pagamentos = [];
    this.valor = null;
    this.valorAluguel = null;
  }

  voltar() {
    this.router.navigate(['/dashboard']);
  }
}
