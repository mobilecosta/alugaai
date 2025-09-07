import { Component, OnInit } from '@angular/core';
import { HeadComponent } from '../../components/head/head.component';
import { CommonModule } from '@angular/common';
import { BotaoLoginComponent } from '../../components/botao-login/botao-login.component';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BotaoCancelarComponent } from '../../components/botao-cancelar/botao-cancelar.component';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { NgxMaskDirective } from 'ngx-mask';
import { ModalSenhaComponent } from './modal-senha/modal-senha.component';
import { CepService } from '../../services/cep/cep.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-config',
  imports: [
    CommonModule,
    FormsModule,
    HeadComponent,
    BotaoLoginComponent,
    ModalComponent,
    BotaoCancelarComponent,
    NgxMaskDirective,
    ModalSenhaComponent,
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
})
export class ConfigComponent implements OnInit {
  private api = environment.apiUrl;

  descontoAntecipado = false;

  nome: string | null = null;
  rg: string | null = null;
  cpf: string | null = null;
  cep: string = '';
  endereco: string | null = null;
  telefone: string | null = null;
  banco: string | null = null;
  conta: string | null = null;
  agencia: string | null = null;
  pix: string = '';

  tempoContratoPadrao: number | null = 12;
  vencimentoPadrao: number = 5;
  reajusteAnual: number = 0;
  boletoAutomatico: boolean = false;
  descontoPagamentoAntecipado: boolean = false;
  valorDescontoAntecipado: number = 0;
  notificacoesPadrao: number | null = 5;

  alterarSenha: boolean = false;

  mensagemModal: string = '';
  tituloModal: string = '';
  mostrarModal: boolean = false;

  bancos = [
    'Banco do Brasil',
    'Banrisul',
    'Bradesco',
    'C6 Bank',
    'Caixa',
    'Inter',
    'Itaú',
    'Mercado Pago',
    'Next',
    'Nubank',
    'Original',
    'PagBank (PagSeguro)',
    'Santander',
    'Sicredi',
    'Outro',
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private usuarioService: UsuarioService,
    private cepService: CepService
  ) {}

  usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  id = this.usuario.id;

  ngOnInit(): void {
    this.buscarUsuario();
  }

  voltar() {
    this.router.navigate(['/dashboard']);
  }

  fecharModal() {
    if (this.mensagemModal == 'Configurações atualizadas!') {
      this.mostrarModal = false;
      this.router.navigate(['/dashboard']);
    }
    this.mostrarModal = false;
  }

  fecharModalSenha() {
    this.alterarSenha = false;
  }

  buscarUsuario() {
    this.usuarioService.buscarUsuario(this.id).subscribe({
      next: (data: any) => {
        this.nome = data.nome;
        this.rg = data.rg;
        this.cpf = data.cpf;
        this.banco = data.banco;
        this.conta = data.conta;
        this.agencia = data.agencia;
        this.pix = data.pix;
        this.endereco = data.endereco;
        this.telefone = data.telefone;
        this.cep = data.cep;
        this.endereco = data.endereco;
      },
    });
  }

  buscarCep(cep: string) {
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    this.cepService.buscarCep(cep).subscribe((res) => {
      if (res.erro) {
        this.mensagemModal = 'CEP não encontrado!';
        this.mostrarModal = true;
        return;
      }

      this.endereco = `${res.logradouro}, ${res.bairro} - ${res.localidade} - ${res.uf}`;
    });
  }

  enviarConfig(formValue: any) {
    const dados = {
      id: this.id,
      tempoContratoPadrao: this.tempoContratoPadrao,
      vencimentoPadrao: this.vencimentoPadrao,
      reajusteAnual: this.reajusteAnual,
      boletoAutomatico: this.boletoAutomatico,
      descontoPagamentoAntecipado: this.descontoAntecipado,
      valorDescontoAntecipado: this.valorDescontoAntecipado,
      nome: this.nome,
      telefone: this.telefone,
      endereco: this.endereco,
      cep: this.cep,
      rg: this.rg,
      cpf: this.cpf,
      banco: this.banco,
      agencia: this.agencia,
      conta: this.conta,
      pix: this.pix,
    };

    this.usuarioService.atualizarUsuario(dados).subscribe({
      next: () => {
        this.mensagemModal = 'Configurações atualizadas!';
        this.tituloModal = 'Sucesso:';
        this.mostrarModal = true;
      },
      error: (err) => {
        console.error('Erro ao buscar usuario', err);
        this.mensagemModal = 'Erro ao atualizar configurações!';
        this.tituloModal = 'Erro';
        this.mostrarModal = true;
      },
    });
  }
}
