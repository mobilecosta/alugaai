import { Component, OnInit } from '@angular/core';
import { HeadComponent } from '../../components/head/head.component';
import { BotaoLoginComponent } from '../../components/botao-login/botao-login.component';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';
import { MoradorService } from '../../services/morador/morador.service';
import { RouterLink } from '@angular/router';

interface Imovel {
  nomePredio: string;
  id: number;
}

interface Unidade {
  numeroUnidade: number;
  id: number;
  morador: { nome: string; id: number; cpf: string; rg: string } | null;
  valorAluguel: number;
  ocupada: boolean;
}

@Component({
  selector: 'app-enviar-boleto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeadComponent,
    BotaoLoginComponent,
    ModalComponent,
    RouterLink,
  ],
  templateUrl: './enviar-boleto.component.html',
  styleUrl: './enviar-boleto.component.scss',
})
export class EnviarBoletoComponent implements OnInit {
  constructor(
    private moradorService: MoradorService,
    private location: Location
  ) {}

  imovelId: number | null = null;
  unidadeId: number | null = null;
  moradorId: number | null = null;
  nomePredio: string = '';
  numeroUnidade: number | null = null;
  valorBoleto: number | null = null;

  moradorNome: string = '';

  modalMensagem: string = '';
  tituloMensagem: string = '';
  mostrarModal: boolean = false;
  loading: boolean = false;

  imoveis: Imovel[] = [];
  unidades: Unidade[] = [];

  enviarBoleto(form: NgForm) {
    this.loading = true;
    if (form.controls['valorBoleto'].invalid) {
      this.modalMensagem = 'Preencha o valor do boleto!';
      this.tituloMensagem = 'Erro:';
      this.mostrarModal = true;
      return;
    }

    const dados = {
      nomePredio: this.nomePredio,
      numeroUnidade: this.numeroUnidade,
      moradorId: this.moradorId,
      valorBoleto: this.valorBoleto,
      unidadeId: this.unidadeId,
    };

    this.moradorService.enviarBoleto(dados).subscribe({
      next: () => {
        this.modalMensagem = 'Boleto enviado com sucesso';
        this.tituloMensagem = 'Sucesso:';
        this.mostrarModal = true;
        this.loading = false;
      },
      error: (err) => {
        this.modalMensagem = `Erro ao enviar boleto!`;
        this.tituloMensagem = 'Erro:';
        this.mostrarModal = true;
      },
    });
  }

  buscarUnidades() {
    if (!this.imovelId) return;

    this.loading = true;

    this.moradorService.listarUnidades(this.imovelId).subscribe({
      next: (data) => {
        this.unidades = data
          .filter((uni: any) => uni.moradorId != null)
          .map((uni: Unidade) => ({
            numeroUnidade: uni.numeroUnidade,
            id: uni.id,
            morador: uni.morador,
            moradorId: uni.morador?.id,
            ocupada: uni.ocupada,
            valorAluguel: uni.valorAluguel,
          }));
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.modalMensagem = err.error.message;
        this.mostrarModal = true;
        this.loading = false;
        return;
      },
    });
  }

  buscarMorador() {
    if (!this.unidadeId || !this.imovelId) return;
    this.loading = true;
    this.moradorService.listarMorador(this.unidadeId, this.imovelId).subscribe({
      next: (data) => {
        this.moradorId = data.id;
        this.moradorNome = data.nome;
        this.loading = false;
      },
      error: (err) => console.error(err),
    });
  }

  cancelar() {
    this.imovelId = null;
    this.unidadeId = null;
    this.moradorId = null;
    this.nomePredio = '';
    this.numeroUnidade = null;
    this.valorBoleto = null;
  }

  voltar() {
    this.location.back();
  }

  fecharModal() {
    if (this.modalMensagem === 'Esse imóvel não possui unidades cadastradas!') {
      this.imovelId = null;
    }
    this.mostrarModal = false;
  }

  ngOnInit(): void {
    this.loading = true;
    this.moradorService.listarImoveis().subscribe({
      next: (data) => {
        this.imoveis = data.map((imovel: Imovel) => ({
          nomePredio: imovel.nomePredio,
          id: imovel.id,
        }));
        this.loading = false;
      },
    });
  }
}
