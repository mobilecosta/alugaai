import { Component, OnInit } from '@angular/core';
import { HeadComponent } from '../../../../components/head/head.component';
import { BotaoLoginComponent } from '../../../../components/botao-login/botao-login.component';
import { MoradorService } from '../../../../services/morador/morador.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { ModalComponent } from '../../../../components/modal/modal.component';
import { CommonModule, Location } from '@angular/common';
import { BotaoCancelarComponent } from '../../../../components/botao-cancelar/botao-cancelar.component';

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
  email: string;
}

@Component({
  selector: 'app-configuracoes-apartamento',
  imports: [
    HeadComponent,
    BotaoLoginComponent,
    FormsModule,
    ModalComponent,
    CommonModule,
    BotaoCancelarComponent,
  ],
  templateUrl: './configuracoes-apartamento.component.html',
  styleUrl: './configuracoes-apartamento.component.scss',
})
export class ConfiguracoesApartamentoComponent implements OnInit {
  unidadeId: number | null = null;
  moradorAtual: MoradorAtual | null = null;
  numeroUnidade: number | null = null;
  nomeMorador: string = '';
  rg: string = '';
  cpf: string = '';
  telefone: string = '';
  email: string = '';
  valorAluguel: number | null = null;
  instalacaoAgua: string = '';
  instalacaoLuz: string = '';
  dataInicioContrato: string = '';
  dataFimContrato: string = '';
  diaVencimento: number | null = null;
  moradorId: number | null = null;

  mensagemModal: string = '';
  mostrarModal: boolean = false;
  tituloModal: string = '';
  loading: boolean = false;

  constructor(
    private moradorService: MoradorService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.unidadeId = Number(id);
      if (!this.unidadeId) return;
      this.moradorService.detalharUnidade(this.unidadeId).subscribe({
        next: (data) => {
          this.moradorAtual = data.Moradores.find(
            (morador: any) => morador.ativo === true
          );
          this.unidadeId = data.id;
          this.numeroUnidade = data.numeroUnidade;
          this.valorAluguel = data.valorAluguel;
          this.instalacaoAgua = data.instalacaoAgua ?? 'Instalação vazia';
          this.instalacaoLuz = data.instalacaoLuz ?? 'Instalação vazia';
          this.nomeMorador = this.moradorAtual?.nome ?? '';
          this.rg = this.formatarRG(this.moradorAtual?.rg ?? '');
          this.cpf = this.formatarCPF(this.moradorAtual?.cpf ?? '');
          this.telefone = this.formatarTelefone(
            this.moradorAtual?.telefone ?? ''
          );
          this.email = this.moradorAtual?.email ?? '';
          this.diaVencimento = this.moradorAtual?.diaVencimento ?? null;
          this.dataInicioContrato = new Date(
            this.moradorAtual?.inicioContrato ?? ''
          )
            .toISOString()
            .slice(0, 10);
          this.dataFimContrato = new Date(this.moradorAtual?.fimContrato ?? '')
            .toISOString()
            .slice(0, 10);
          this.moradorId = this.moradorAtual?.id ?? null;
        },
      });
    });
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

  enviarFormulario(form: NgForm) {
    const dados = {
      moradorId: this.moradorId,
      unidadeId: this.unidadeId,
      nome: this.nomeMorador,
      rg: this.rg,
      cpf: this.cpf,
      instalacaoAgua: this.instalacaoAgua,
      instalacaoLuz: this.instalacaoLuz,
      telefone: this.telefone,
      email: this.email,
      valorAluguel: this.valorAluguel,
      inicioContrato: new Date(this.dataInicioContrato)
        .toISOString()
        .slice(0, 10),
      fimContrato: new Date(this.dataFimContrato).toISOString().slice(0, 10),
      diaVencimento: this.diaVencimento,
    };

    this.moradorService.atualizarUnidade(dados).subscribe({
      next: (data) => {
        this.mensagemModal = data.message;
        this.tituloModal = 'Sucesso';
        this.mostrarModal = true;
      },
      error: (err) => {
        this.mensagemModal = err.error.message;
        this.tituloModal = 'Erro:';
        this.mostrarModal = true;
      },
    });
  }

  deleteMorador() {
    if (!this.moradorId || !this.unidadeId) return;

    this.moradorService
      .deletarMorador(this.moradorId, this.unidadeId)
      .subscribe({
        next: (data) => {
          this.mensagemModal = data.message;
          this.mostrarModal = true;
        },
        error: (err) => {
          console.error(err), (this.mensagemModal = err.error?.message);
          this.mostrarModal = true;
        },
      });
  }

  deleteUnidade() {
    if (!this.unidadeId) return;

    this.loading = true;

    this.moradorService.deletarUnidade(this.unidadeId).subscribe({
      next: (data) => {
        this.mensagemModal = data.message;
        this.mostrarModal = true;
        this.loading = false;
      },
      error: (err) => {
        this.mensagemModal = err.error.message;
        this.mostrarModal = true;
        this.loading = false;
      },
    });
  }

  formatarData(dataStr: string): string {
    const [dia, mes, ano] = dataStr.split('/');
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }

  fecharModal() {
    if (
      this.mensagemModal == 'Morador excluído com sucesso!' ||
      this.mensagemModal == 'Unidade excluída com sucesso!'
    ) {
      this.router.navigate(['/dashboard/consultar']);
      this.mostrarModal = false;
    } else if (this.mensagemModal == 'Dados atualizados com sucesso!') {
      this.router.navigate([`/dashboard/consultar/${this.unidadeId}`]);
    }
    this.mostrarModal = false;
  }

  voltar() {
    this.location.back();
  }
}
