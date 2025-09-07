import { Component, OnInit } from '@angular/core';
import { HeadComponent } from '../../components/head/head.component';
import { BotaoLoginComponent } from '../../components/botao-login/botao-login.component';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CepService } from '../../services/cep/cep.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { MoradorService } from '../../services/morador/morador.service';

@Component({
  selector: 'app-cadastrar-predio',
  standalone: true,
  imports: [
    FormsModule,
    HeadComponent,
    BotaoLoginComponent,
    ModalComponent,
    CommonModule,
    NgxMaskDirective,
  ],
  templateUrl: './cadastrar-predio.component.html',
  styleUrl: './cadastrar-predio.component.scss',
})
export class CadastrarPredioComponent implements OnInit {
  nomePredio: string = '';
  quantidadeUnidades: number | null = null;
  cep: string = '';
  estado: string = '';
  cidade: string = '';
  bairro: string = '';
  rua: string = '';
  usuarioId: number | null = null;
  valorAluguel: number | null = null;
  comodos: number | null = null;

  mostrarModal: boolean = false;
  tituloModal: string = '';
  mensagemModal: string = '';

  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cepService: CepService,
    private moradorService: MoradorService
  ) {}

  ngOnInit(): void {
    const usuarioLogado = localStorage.getItem('usuario');
    if (usuarioLogado) {
      const usuario = JSON.parse(usuarioLogado);
      this.usuarioId = usuario.id;
    }
  }

  buscarCep(cep: string) {
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    this.cepService.buscarCep(cep).subscribe((res) => {
      if (res.erro) {
        this.mensagemModal = 'CEP não encontrado!';
        this.mostrarModal = true;
        return;
      }

      this.estado = res.uf;
      this.cidade = res.localidade;
      this.bairro = res.bairro;
      this.rua = res.logradouro;
    });
  }

  voltar() {
    this.router.navigate(['/dashboard']);
  }

  enviarFormulario(form: NgForm) {
    const camposObrigatorios = [
      { nome: 'nomePredio', msg: 'Preencha o nome do imóvel' },
      { nome: 'cep', msg: 'O CEP do imóvel é obrigatório!' },
      {
        nome: 'estado',
        msg: 'Preencha o estado onde fica localizado o imóvel!',
      },
      {
        nome: 'cidade',
        msg: 'Preencha a cidade do imóvel!',
      },
      {
        nome: 'bairro',
        msg: 'Preencha o bairro do imóvel!',
      },
      {
        nome: 'rua',
        msg: 'Preencha a rua do imóvel!',
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

    const dados: any = {
      nomePredio: this.nomePredio,
      quantidadeUnidades: this.quantidadeUnidades,
      cep: this.cep.replace(/\D/g, ''),
      estado: this.estado,
      cidade: this.cidade,
      bairro: this.bairro,
      rua: this.rua,
      usuarioId: this.usuarioId,
    };

    if (this.quantidadeUnidades && this.quantidadeUnidades > 0) {
      if (!this.valorAluguel || this.valorAluguel <= 0) {
        this.mensagemModal = 'Informe um valor válido para o aluguel.';
        this.tituloModal = 'Erro:';
        this.mostrarModal = true;
        return;
      } else if (!this.comodos || this.comodos <= 0) {
        this.mensagemModal = 'Informe a quantidade de cômodos padrão!';
        this.tituloModal = 'Erro:';
        this.mostrarModal = true;
        return;
      }
      dados.valorAluguel = this.valorAluguel;
      dados.comodos = this.comodos;
    }

    this.moradorService.cadastrarImovel(dados).subscribe({
      next: () => {
        this.mensagemModal = 'Imóvel cadastrado com sucesso.';
        this.tituloModal = 'Sucesso!';
        this.mostrarModal = true;
      },
      error: () => {
        this.mensagemModal = 'Erro ao cadastrar imóvel.';
        this.tituloModal = 'Erro:';
        this.mostrarModal = true;
      },
    });
  }

  fecharModal() {
    if (this.mensagemModal == 'Imóvel cadastrado com sucesso.') {
      this.router.navigate(['/dashboard/consultar']);
    }
    this.mostrarModal = false;
  }
}
