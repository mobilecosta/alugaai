import { Component, OnInit } from '@angular/core';
import { HeadComponent } from '../../components/head/head.component';
import { BotaoLoginComponent } from '../../components/botao-login/botao-login.component';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { ModalComponent } from '../../components/modal/modal.component';
import { MoradorService } from '../../services/morador/morador.service';
import { Location } from '@angular/common';
import { BotaoCancelarComponent } from '../../components/botao-cancelar/botao-cancelar.component';
import { environment } from '../../../environments/environment';

interface Imovel {
  id: number;
  nomePredio: string;
  endereco: string;
}

interface Unidade {
  numero: number;
  id: number;
  valorAluguel: number;
  ocupada: boolean;
}

@Component({
  selector: 'app-cadastrar-morador',
  imports: [
    CommonModule,
    FormsModule,
    NgxMaskDirective,
    HeadComponent,
    BotaoLoginComponent,
    ModalComponent,
    RouterLink,
    BotaoCancelarComponent,
  ],
  templateUrl: './cadastrar-morador.component.html',
  styleUrl: './cadastrar-morador.component.scss',
})
export class CadastrarMoradorComponent implements OnInit {
  private api = environment.apiUrl;

  nome: string = '';
  dataNascimento: string = '';
  dataInicioContrato: string = '';
  enderecoUnidade: string = '';
  dataFimContrato: string = '';
  imovelId: number | null = null;
  numeroUnidade: number | null = null;
  valorAluguel: number | null = null;
  diaVencimento: number | null = null;
  rg: string = '';
  cpf: string = '';
  telefone: string = '';
  email: string = '';
  unidadeId: number | null = null;
  loading: boolean = false;

  nomePredio: string = '';

  mensagemModal: string = '';
  tituloModal: string = '';
  mostrarModal: boolean = false;

  imoveis: Imovel[] = [];

  unidades: Unidade[] = [];

  constructor(
    private router: Router,
    private moradorService: MoradorService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.buscarImoveis();
  }

  buscarImoveis() {
    this.loading = true;
    this.moradorService.listarImoveis().subscribe({
      next: (data) => {
        this.imoveis = data
          .map((imovel: any) => ({
            id: imovel.id,
            nomePredio: imovel.nomePredio,
            endereco: `${imovel.rua}, ${imovel.bairro} - ${imovel.cidade}`,
          }))
          .sort((a: any, b: any) => a.nomePredio.localeCompare(b.nomePredio));
        this.loading = false;
      },
      error: (err) => {
        this.mensagemModal = err.error.message;
        this.mostrarModal = true;
        this.loading = false;
        console.error(err);
      },
    });
  }

  buscarUnidades() {
    if (this.imovelId == null) return;
    this.loading = true;
    this.moradorService.listarUnidades(this.imovelId).subscribe({
      next: (data) => {
        this.unidades = data
          .filter((unidade: Unidade) => unidade.ocupada == false)
          .map((unidade: any) => ({
            id: unidade.id,
            numero: unidade.numeroUnidade,
            valorAluguel: unidade.valorAluguel,
          }));
        this.loading = false;
      },
      error: (err) => {
        console.error(err), (this.loading = false);
      },
    });
  }

  selecionarCampos() {
    const imovel = this.imoveis.find((i) => i.id === this.imovelId);

    if (imovel) {
      this.enderecoUnidade = imovel.endereco;
      this.nomePredio = imovel.nomePredio;

      this.imovelId = imovel.id;
      this.buscarUnidades();
    }
  }

  selecionarUnidade() {
    const unidadeSelecionada = this.unidades.find(
      (u) => u.id === this.unidadeId
    );

    if (unidadeSelecionada) {
      this.numeroUnidade = unidadeSelecionada.numero;
      this.valorAluguel = unidadeSelecionada.valorAluguel;
    }
  }

  enviarFormulario(form: NgForm) {
    const telefoneLimpo = this.telefone.replace(/\D/g, '');
    const cpfLimpo = this.cpf.replace(/\D/g, '');
    const rgLimpo = this.rg.replace(/\D/g, '');
    const camposObrigatorios = [
      { nome: 'nome', msg: 'Digite o nome do morador!' },
      {
        nome: 'dataNascimento',
        msg: 'Digite a data de nascimento do morador!',
      },
      {
        nome: 'rg',
        msg: 'Digite o RG do morador!',
      },
      {
        nome: 'cpf',
        msg: 'Digite o CPF do morador!',
      },
      {
        nome: 'dataInicioContrato',
        msg: 'Digite uma data para iniciar o contrato!',
      },
      {
        nome: 'telefone',
        msg: 'Digite o telefone do morador!',
      },
      {
        nome: 'email',
        msg: 'Digite o email do morador!',
      },
      {
        nome: 'dataFimContrato',
        msg: 'Digite uma data para terminar o contrato!',
      },
      {
        nome: 'diaVencimento',
        msg: 'Digite um dia de vencimento válido!',
      },
    ];

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

    if (
      this.diaVencimento == null ||
      this.diaVencimento < 1 ||
      this.diaVencimento > 31
    ) {
      this.mensagemModal = 'O dia de vencimento está invalido!';
      this.tituloModal = 'Erro:';
      return;
    }

    const dados = {
      nome: this.nome,
      dataNascimento: new Date(this.dataNascimento).toISOString().slice(0, 10),
      dataInicioContrato: new Date(this.dataInicioContrato)
        .toISOString()
        .slice(0, 10),
      dataFimContrato: new Date(this.dataFimContrato)
        .toISOString()
        .slice(0, 10),
      diaVencimento: this.diaVencimento,
      nomePredio: this.nomePredio,
      numeroUnidade: this.numeroUnidade,
      valorAluguel: this.valorAluguel,
      rg: rgLimpo,
      cpf: cpfLimpo,
      telefone: telefoneLimpo,
      email: this.email,
      imovelId: this.imovelId,
      unidadeId: this.unidadeId,
    };

    this.moradorService.cadastrarMorador(dados).subscribe({
      next: () => {
        this.mensagemModal = 'Morador cadastrado com sucesso!';
        this.tituloModal = 'Sucesso:';
        this.mostrarModal = true;
        this.loading = false;

        this.moradorService.criarContrato(dados).subscribe({
          error: (err) => {
            console.error('erro no contrato', err);
          },
        });
      },
      error: (err: any) => {
        console.error(err);
        this.mensagemModal = err.error.message;
        this.tituloModal = 'Erro:';
        this.mostrarModal = true;
      },
    });
  }

  voltar() {
    this.location.back();
  }

  cancelar() {
    this.imovelId = null;
    this.unidadeId = null;
    this.unidades = [];
  }

  fecharModal() {
    if (!this.unidadeId) return;

    if (this.mensagemModal == 'Morador cadastrado com sucesso!') {
      this.router.navigate([
        '/dashboard/consultar',
        encodeURIComponent(this.unidadeId),
      ]);
    }

    this.mostrarModal = false;
  }
}
