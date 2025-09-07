import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HeadComponent } from '../../../components/head/head.component';
import { BotaoAdicionarComponent } from '../../../components/botao-adicionar/botao-adicionar.component';
import { MoradorService } from '../../../services/morador/morador.service';
import { ModalComponent } from '../../../components/modal/modal.component';
import { HistoricoMoradoresComponent } from './historico-moradores/historico-moradores.component';
import { ModalRenovarComponent } from './modal-renovar/modal-renovar.component';

interface Morador {
  id: number;
  nome: string;
  rg: string;
  cpf: string;
  dataNascimento: string;
  email?: string;
  telefone: string;
  inicioContrato: string;
  fimContrato: string;
  diaPagamento: number;
  ativo: boolean;
  contrato: string;
}

interface Unidade {
  id: number;
  numeroUnidade: number;
  imovelId: number;
  moradorId: number;
  ocupada: boolean;
  valorAluguel: number;
  Moradores: Morador[];
  instalacaoLuz?: string;
  instalacaoAgua?: string;
}

interface MoradorAtual {
  id: number;
  nome: string;
  telefone: string;
  cpf: string;
  rg: string;
  contrato: string;
  inicioContrato: Date;
  fimContrato: Date;
  diaVencimento: number;
}

@Component({
  selector: 'app-apartamento',
  standalone: true,
  imports: [
    CommonModule,
    HeadComponent,
    BotaoAdicionarComponent,
    RouterLink,
    ModalComponent,
    HistoricoMoradoresComponent,
    ModalRenovarComponent,
  ],
  templateUrl: './apartamento.component.html',
  styleUrls: ['./apartamento.component.scss'],
})
export class ApartamentoComponent implements OnInit {
  id!: string;
  unidadeId: number | null = null;
  unidade: Unidade | null = null;
  moradorId: number | null = null;
  moradorTelefone: string = '';
  moradorRg: string = '';
  moradorCpf: string = '';
  inicioContrato: Date | null = null;
  fimContrato: Date | null = null;
  contrato: string = '';
  diasParaVencer: number | null = null;
  loading: boolean = false;
  moradoresAntigos: Morador[] = [];
  moradorAtual: MoradorAtual | null = null;

  contratoPertoDoVencimento: boolean = false;
  renovarContrato: boolean = false;
  verMoradoresAntigos: boolean = false;

  mensagemModal: string = '';
  tituloModal: string = '';
  mostrarModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private moradorService: MoradorService,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.unidadeId = Number(params['id']);
      if (!this.unidadeId) return;

      this.moradorService.detalharUnidade(this.unidadeId).subscribe({
        next: (data) => {
          this.unidade = data;
          this.moradorAtual = data.Moradores.find(
            (morador: any) => morador.ativo
          );

          if (this.moradorAtual) {
            this.moradorId = this.moradorAtual.id;
            this.moradorTelefone = this.formatarTelefone(
              this.moradorAtual.telefone
            );
            this.moradorCpf = this.formatarCPF(this.moradorAtual.cpf);
            this.moradorRg = this.formatarRG(this.moradorAtual.rg);
            this.inicioContrato = new Date(this.moradorAtual.inicioContrato);
            this.fimContrato = new Date(this.moradorAtual.fimContrato);
            this.contrato = this.moradorAtual.contrato;
            this.verificarContrato();
          }

          this.moradoresAntigos = data.Moradores.filter(
            (morador: any) => !morador.ativo
          );
        },
        error: (err) => console.log(err),
      });
    });
  }

  get primeiraLetra() {
    return this.moradorAtual?.nome.charAt(0).toUpperCase();
  }

  formatarCPF(cpf: string): string {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }

  formatarRG(rg: string): string {
    return rg.replace(/^(\d{2})(\d{3})(\d{3})(\d?)$/, '$1.$2.$3-$4');
  }

  formatarTelefone(telefone: string): string {
    return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }

  ligar() {
    window.location.href = `tel:+55${this.moradorTelefone}`;
  }

  cancelar() {
    this.verMoradoresAntigos = false;
  }

  whatsapp() {
    window.location.href = `https://wa.me/55${this.moradorTelefone}`;
  }

  verificarContrato() {
    if (!this.fimContrato) return;

    const dataAtual = new Date();
    const dataFim = new Date(this.fimContrato);

    const diferencaMs = dataFim.getTime() - dataAtual.getTime();
    const diasRestantes = Math.ceil(diferencaMs / (1000 * 60 * 60 * 24));
    this.diasParaVencer = diasRestantes;

    if (diasRestantes >= 0 && diasRestantes <= 20) {
      this.contratoPertoDoVencimento = true;
    } else {
      this.contratoPertoDoVencimento = false;
    }
  }

  modalRenovarContrato() {
    this.renovarContrato = !this.renovarContrato;
  }

  esvaziarUnidade() {
    if (!this.moradorId || !this.unidadeId) return;
    this.loading = true;

    this.moradorService
      .deletarMorador(this.moradorId, this.unidadeId)
      .subscribe({
        next: (data) => {
          this.mensagemModal = data.message;
          this.tituloModal = 'Sucesso';
          this.mostrarModal = true;
          this.loading = false;
        },
        error: (err) => {
          this.mensagemModal = err.error.message;
          this.tituloModal = 'Erro:';
          this.mostrarModal = true;
          this.loading = false;
        },
      });
  }

  excluirUnidade() {
    if (!this.unidadeId) return;

    this.moradorService.deletarUnidade(this.unidadeId).subscribe({
      next: (data) => {
        this.mensagemModal = data.message;
        this.tituloModal = 'Sucesso:';
        this.mostrarModal = true;
      },
      error: (err) => {
        this.mensagemModal = err.error.message;
        this.tituloModal = 'Erro';
        this.mostrarModal = true;
      },
    });
  }

  baixarContrato() {
    const dados = {
      unidadeId: this.unidadeId,
    };
    this.loading = true;
    this.moradorService.criarContrato(dados).subscribe({
      next: (data) => {
        this.loading = false;

        if (data.url) {
          window.open(data.url, '_blank');
          this.contrato = data.url;
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      },
    });
  }

  fecharModal() {
    if (
      this.mensagemModal === 'Morador excluído com sucesso!' ||
      this.mensagemModal === 'Unidade excluída com sucesso!'
    ) {
      this.router.navigate(['/dashboard/consultar']);
    } else {
      this.mostrarModal = false;
    }
  }

  voltar() {
    this.location.back();
  }
}
