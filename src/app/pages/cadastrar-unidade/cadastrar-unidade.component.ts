import { Component, OnInit } from '@angular/core';
import { HeadComponent } from '../../components/head/head.component';
import { CommonModule, Location } from '@angular/common';
import { BotaoLoginComponent } from '../../components/botao-login/botao-login.component';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { HttpClient } from '@angular/common/http';
import { ModalComponent } from '../../components/modal/modal.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { MoradorService } from '../../services/morador/morador.service';
import { BotaoCancelarComponent } from '../../components/botao-cancelar/botao-cancelar.component';

interface Imovel {
  nomePredio: string;
  endereco: string;
  imovelId: number;
}

@Component({
  selector: 'app-cadastrar-unidade',
  standalone: true,
  imports: [
    NgxMaskDirective,
    CommonModule,
    FormsModule,
    HeadComponent,
    BotaoLoginComponent,
    ModalComponent,
    RouterLink,
    BotaoCancelarComponent,
  ],
  templateUrl: './cadastrar-unidade.component.html',
  styleUrl: './cadastrar-unidade.component.scss',
})
export class CadastrarUnidadeComponent implements OnInit {
  imovelId: number | null = null;
  nomePredio: string = '';
  enderecoUnidade: string = '';
  numeroUnidade: number | null = null;
  valorAluguel: number | null = null;
  comodos: number | null = null;
  instalacaoLuz: number | null = null;
  instalacaoAgua: number | null = null;
  ocupada: boolean = false;

  morador: string = '';
  diaVencimento: number | null = null;
  dataNascimento: string = '';
  rg: string = '';
  cpf: string = '';
  dataInicioContrato: string = '';
  dataFimContrato: string = '';
  telefone: string = '';
  email: string = '';

  mensagemModal: string = '';
  tituloModal: string = '';
  mostrarModal: boolean = false;
  loading: boolean = false;

  imoveis: Imovel[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private moradorService: MoradorService
  ) {}

  ngOnInit(): void {
    this.buscarImoveis();
    this.loading = true;
  }

  buscarImoveis() {
    this.moradorService.listarImoveis().subscribe({
      next: (data) => {
        this.imoveis = data
          .map((imovel: any) => ({
            nomePredio: imovel.nomePredio,
            endereco: `${imovel.rua}, ${imovel.bairro} - ${imovel.cidade}`,
            imovelId: imovel.id,
          }))
          .sort((a: any, b: any) => a.nomePredio.localeCompare(b.nomePredio));
        this.loading = false;
      },
      error: (err) => console.error(err),
    });
  }

  selecionarImovel(event: Event) {
    const imovel = this.imoveis.find(
      (p) => p.imovelId === Number(this.imovelId)
    );

    if (imovel) {
      this.enderecoUnidade = imovel.endereco;
      this.imovelId = imovel.imovelId;
    }

    console.log('imovel: ', imovel);
  }

  enviarFormulario(form: NgForm) {
    const telefoneLimpo = this.telefone.replace(/\D/g, '');
    const cpfLimpo = this.cpf.replace(/\D/g, '');
    const rgLimpo = this.rg.replace(/\D/g, '');
    this.loading = true;

    const camposObrigatorios = [
      { nome: 'nomePredio', msg: 'O nome do prédio não pode ser vazio!' },
      { nome: 'enderecoUnidade', msg: 'O imóvel precisa ter um endereço!' },
      {
        nome: 'numeroUnidade',
        msg: 'A unidade precisa ter um número de identificação!',
      },
      { nome: 'valorAluguel', msg: 'O valor do aluguel precisa ser definido!' },
      { nome: 'ocupada', msg: 'Escolha se a unidade está vazia ou ocupada!' },
    ];

    if (this.ocupada) {
      camposObrigatorios.push(
        { nome: 'morador', msg: 'Digite o nome do morador!' },
        {
          nome: 'dataNascimento',
          msg: 'Digite a data de nascimento do morador!',
        },
        { nome: 'rg', msg: 'Digite o RG do morador!' },
        { nome: 'cpf', msg: 'Digite o CPF do morador!' },
        { nome: 'dataFimContrato', msg: 'Selecione a data final do contrato!' },
        {
          nome: 'dataInicioContrato',
          msg: 'Selecione a data de inicio do contrato!',
        },
        {
          nome: 'instalacaoAgua',
          msg: 'Digite uma instalação de água válida!',
        },
        {
          nome: 'instalacaoLuz',
          msg: 'Digite uma instalação de luz válida!',
        },
        { nome: 'telefone', msg: 'Digite o número de telefone do morador!' }
      );
      if (
        this.diaVencimento == null ||
        this.diaVencimento < 0 ||
        this.diaVencimento > 31
      ) {
        this.mensagemModal = 'Insira um dia de vencimento válido!';
        this.mostrarModal = true;
        return;
      }
    }

    for (let campo of camposObrigatorios) {
      if (form.controls[campo.nome].invalid) {
        this.mensagemModal = campo.msg;
        this.tituloModal = 'Erro:';
        this.mostrarModal = true;
        return;
      }
    }

    const inicio = new Date(this.dataInicioContrato);
    const fim = new Date(this.dataFimContrato);

    if (inicio >= fim) {
      this.mensagemModal =
        'A data final do contrato deve ser maior que a data de início.';
      this.tituloModal = 'Erro:';
      this.mostrarModal = true;
      return;
    }

    const dados: any = {
      imovelId: this.imovelId,
      numeroUnidade: this.numeroUnidade,
      valorAluguel: this.valorAluguel,
      instalacaoAgua: this.instalacaoAgua,
      instalacaoLuz: this.instalacaoLuz,
      comodos: this.comodos,
      ocupada: this.ocupada,
    };

    if (this.ocupada) {
      dados.morador = this.morador;
      dados.dataNascimento = new Date(this.dataNascimento)
        .toISOString()
        .slice(0, 10);
      dados.rg = rgLimpo;
      dados.cpf = cpfLimpo;
      dados.dataInicioContrato = new Date(this.dataInicioContrato)
        .toISOString()
        .slice(0, 10);
      dados.dataFimContrato = new Date(this.dataFimContrato)
        .toISOString()
        .slice(0, 10);
      dados.diaVencimento = this.diaVencimento;
      dados.telefone = telefoneLimpo;
      dados.email = this.email;
      dados.imovelId = this.imovelId;
    }

    this.moradorService.cadastrarUnidade(dados).subscribe({
      next: (res: any) => {
        this.mensagemModal = res.message;
        this.tituloModal = 'Sucesso:';
        this.mostrarModal = true;
        this.loading = false;
      },
      error: (err) => {
        this.mensagemModal = err.error?.message;
        this.tituloModal = 'Erro:';
        this.mostrarModal = true;
      },
    });
  }

  fecharModal() {
    if (
      this.mensagemModal == 'Unidade cadastrada com sucesso!' ||
      this.mensagemModal == 'Unidade cadastrada como vaga!'
    ) {
      this.mostrarModal = false;
      this.router.navigate([`/dashboard/consultar/`]);
    }

    this.mostrarModal = false;
    this.loading = false;
  }

  voltar() {
    this.router.navigate(['/dashboard']);
  }

  cancelar() {
    this.imovelId = null;
  }
}
