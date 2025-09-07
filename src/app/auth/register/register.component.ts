import { Component } from '@angular/core';
import { BotaoLoginComponent } from '../../components/botao-login/botao-login.component';
import { FormsModule, NgForm } from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';
import { CommonModule, Location } from '@angular/common';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { CepService } from '../../services/cep/cep.service';
import { HeadComponent } from '../../components/head/head.component';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    CommonModule,
    BotaoLoginComponent,
    ModalComponent,
    NgxMaskDirective,
    HeadComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  nome: string = '';
  dataNascimento: string = '';
  rg: string = '';
  cpf: string = '';
  banco: string = '';
  agencia: string = '';
  mascaraConta: string = '000000-0';
  conta: string = '';
  endereco: string = '';
  pix: string = '';
  telefone: string = '';
  email: string = '';
  senha: string = '';
  cep: string = '';
  senhaConfirmada: string = '';

  mensagemModal: string = '';
  tituloModal: string = '';
  mostrarModal: boolean = false;

  loading: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private cepService: CepService,
    private location: Location
  ) {}

  voltar() {
    this.location.back();
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

  atualizarBanco() {
    switch (this.banco) {
      case 'Caixa':
        this.mascaraConta = '000000-0';
        break;
      case 'Bradesco':
        this.mascaraConta = '0000000-0';
        break;
      case 'Itau':
        this.mascaraConta = '00000-0';
        break;
      case 'Banco do Brasil':
        this.mascaraConta = '00000000-0';
        break;
      case 'Santander':
        this.mascaraConta = '00000000-0';
        break;
      default:
        this.mascaraConta = '00000000-0';
    }
  }

  enviarFormulario(form: NgForm) {
    this.loading = true;
    const dataAtual = new Date();
    const nascimento = new Date(this.dataNascimento);
    let idade = dataAtual.getFullYear() - nascimento.getFullYear();

    if (idade < 18) {
      this.loading = false;
      this.mensagemModal =
        'Você precisa ser maior de 18 anos para se cadastrar!';
      this.tituloModal = 'Erro:';
      this.mostrarModal = true;
      return;
    }

    const camposObrigatorios = [
      { nome: 'nome', msg: 'Digite o seu nome!' },
      { nome: 'dataNascimento', msg: 'Digite a sua data de nascimento!' },
      { nome: 'pix', msg: 'Digite uma chave pix, para gerar boletos!' },
      { nome: 'telefone', msg: 'Digite um número de telefone!' },
      { nome: 'email', msg: 'Digite um e-mail válido!' },
      { nome: 'senha', msg: 'Digite uma senha!' },
      { nome: 'rg', msg: 'Digite o número do RG!' },
      { nome: 'cep', msg: 'Digite seu CEP' },
      { nome: 'cpf', msg: 'Digite o número do CPF!' },
      { nome: 'endereco', msg: 'Digite um endereço!' },
      {
        nome: 'agencia',
        msg: 'Digite sua agencia bancária, para gerar os contratos!',
      },
      {
        nome: 'conta',
        msg: 'Digite sua conta bancária, para gerar os contratos!',
      },
    ];

    for (let campos of camposObrigatorios) {
      if (form.controls[campos.nome].invalid) {
        this.loading = false;
        this.mensagemModal = campos.msg;
        this.tituloModal = 'Erro:';
        this.mostrarModal = true;
        return;
      }
    }

    if (this.senha != this.senhaConfirmada) {
      this.loading = false;
      this.mensagemModal = 'As senhas estão diferentes, tente novamente!';
      this.tituloModal = 'Erro:';
      this.mostrarModal = true;
      return;
    }

    const dados = {
      nome: this.nome,
      dataNascimento: new Date(this.dataNascimento).toISOString().slice(0, 10),
      rg: this.rg,
      cpf: this.cpf,
      cep: this.cep,
      endereco: this.endereco,
      banco: this.banco,
      agencia: this.agencia,
      conta: this.conta,
      pix: this.pix,
      telefone: this.telefone,
      email: this.email,
      senha: this.senha,
      senhaConfirmada: this.senhaConfirmada,
    };

    this.usuarioService.cadastrarUsuario(dados).subscribe({
      next: (res: any) => {
        this.mensagemModal = res.message;
        this.tituloModal = 'Sucesso:';
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

  fecharModal() {
    if (this.mensagemModal == 'Usuário criado com sucesso!') {
      this.router.navigate(['/login']);
      this.loading = false;
    }
    this.mostrarModal = false;
    this.loading = false;
  }
}
