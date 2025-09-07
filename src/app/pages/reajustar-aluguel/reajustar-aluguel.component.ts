import { Component, OnInit } from '@angular/core';
import { HeadComponent } from '../../components/head/head.component';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MoradorService } from '../../services/morador/morador.service';
import { BotaoLoginComponent } from '../../components/botao-login/botao-login.component';
import { Router, RouterLink } from '@angular/router';
import { ModalComponent } from '../../components/modal/modal.component';
import { BotaoCancelarComponent } from '../../components/botao-cancelar/botao-cancelar.component';

interface Imovel {
  id: number;
  nomePredio: string;
}

interface Unidade {
  id: number;
  numeroUnidade: number;
  valorAluguel: number;
  ocupada: boolean;
}

@Component({
  selector: 'app-reajustar-aluguel',
  imports: [
    HeadComponent,
    CommonModule,
    FormsModule,
    BotaoLoginComponent,
    RouterLink,
    ModalComponent,
    BotaoCancelarComponent,
  ],
  templateUrl: './reajustar-aluguel.component.html',
  styleUrl: './reajustar-aluguel.component.scss',
})
export class ReajustarAluguelComponent implements OnInit {
  imoveis: Imovel[] = [];
  unidades: Unidade[] = [];
  imovelId: number | null = null;
  unidadeId: number | null = null;
  unidadeSelecionada: Unidade | null = null;
  valorAluguelAtual: number | null = null;
  valorAluguel: number | null = null;

  loading: boolean = false;

  mensagemModal: string = '';
  tituloModal: string = '';
  mostrarModal: boolean = false;

  constructor(private moradorService: MoradorService, private router: Router) {}

  ngOnInit(): void {
    this.moradorService.listarImoveis().subscribe({
      next: (data) => {
        this.imoveis = data;
      },
    });
  }

  voltar() {
    this.router.navigate(['/dashboard']);
  }

  cancelar() {
    this.unidadeSelecionada = null;
    this.imovelId = null;
    this.unidadeId = null;
    this.imoveis = [...this.imoveis];
    this.unidades = [];
    this.loading = false;
  }

  fecharModal() {
    if (this.mensagemModal == 'Dados atualizados com sucesso!') {
      this.cancelar();
    }
    this.mostrarModal = false;
  }

  buscarUnidades() {
    if (!this.imovelId) return;
    this.loading = true;

    this.moradorService.listarUnidades(this.imovelId).subscribe({
      next: (data) => {
        this.unidades = data;
      },
    });
    this.loading = false;
  }

  definirUnidade() {
    this.unidadeSelecionada =
      this.unidades.find((uni) => uni.id === Number(this.unidadeId)) || null;

    this.valorAluguelAtual = this.unidadeSelecionada?.valorAluguel || null;
    this.loading = false;
  }

  atualizarAluguel(event: Event) {
    event.preventDefault();
    const dados = {
      unidadeId: this.unidadeSelecionada?.id,
      valorAluguel: this.valorAluguel,
    };

    this.moradorService.atualizarUnidade(dados).subscribe({
      next: (data) => {
        this.mensagemModal = data.message;
        this.tituloModal = 'Sucesso:';
        this.mostrarModal = true;
      },
      error: (err) => {
        console.error(err);
        this.mensagemModal = 'Erro ao atualizar valor!';
        this.tituloModal = 'Erro:';
        this.mostrarModal = true;
      },
    });
  }
}
