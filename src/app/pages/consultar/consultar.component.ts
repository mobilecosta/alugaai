import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeadComponent } from '../../components/head/head.component';
import { BotaoAdicionarComponent } from '../../components/botao-adicionar/botao-adicionar.component';
import { AuthService } from '../../services/auth/auth.service';
import { MoradorService } from '../../services/morador/morador.service';
import { SearchComponent } from '../../components/search/search.component';
import { Router, RouterLink } from '@angular/router';

interface Imovel {
  nome: string;
  id: number;
  endereco: string;
}

interface Unidade {
  id: number;
  numero: number;
  morador?: { nome: string } | null;
  ocupada: boolean;
}

@Component({
  selector: 'app-consultar',
  imports: [
    CommonModule,
    HeadComponent,
    RouterLink,
    BotaoAdicionarComponent,
    SearchComponent,
    RouterLink,
  ],
  templateUrl: './consultar.component.html',
  styleUrl: './consultar.component.scss',
})
export class ConsultarComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private moradorService: MoradorService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.moradorService.listarImoveis().subscribe({
      next: (data) => {
        this.imoveis = data
          .map((imovel: any) => ({
            id: imovel.id,
            nome: imovel.nomePredio,
            endereco: `${imovel.rua}, ${imovel.bairro} - ${imovel.cidade}`,
          }))
          .sort((a: any, b: any) => a.nome.localeCompare(b.nome));

        this.loading = false;
      },
    });
  }

  filter: string | null = null;

  setFilter(value: string) {
    this.filter = value;
    this.filtrar();
  }

  imovelSelecionado: number | null = null;
  imovelSelecionadoNome: string = '';
  unidadeSelecionada: number | null = null;
  pesquisa: string = '';

  loading: boolean = false;

  imoveis: Imovel[] = [];
  unidades: Unidade[] = [];
  filtrados: Unidade[] = [];

  mensagemModal: string = '';
  tituloModal: string = '';
  mostrarModal: boolean = false;

  voltar() {
    this.router.navigate(['/dashboard']);
  }

  cancelar() {
    this.imovelSelecionado = null;
    this.unidadeSelecionada = null;
    this.unidades = [];
    this.pesquisa = '';
    this.filter = null;
    this.filtrados = [...this.unidades];
  }

  buscarUnidade() {
    this.loading = true;
    if (!this.imovelSelecionado) {
      this.loading = false;
      return;
    }

    this.moradorService.listarUnidades(this.imovelSelecionado).subscribe({
      next: (data) => {
        this.unidades = data
          .map((unidade: any) => {
            const moradorAtivo = unidade.Moradores.find(
              (morador: any) => morador.ativo === true
            );

            return {
              id: unidade.id,
              numero: unidade.numeroUnidade,
              ocupada: unidade.ocupada,
              morador: moradorAtivo
                ? {
                    nome: moradorAtivo.nome.split(' ').slice(0, 2).join(' '),
                  }
                : null,
            };
          })
          .sort((a: any, b: any) => a.numero - b.numero);

        this.filtrados = [...this.unidades];
        this.loading = false;
      },
      error: (err) => {
        this.mensagemModal = err.error.message;
        this.mostrarModal = true;
        this.tituloModal = 'Erro';
        this.loading = false;
        console.error(err);
      },
    });
  }

  filtrar() {
    const texto = this.pesquisa.trim().toLowerCase();

    this.filtrados = this.unidades.filter((item) => {
      if (this.filter === 'Ocupadas' && !item.ocupada) return false;
      if (this.filter === 'Desocupadas' && item.ocupada) return false;

      if (!texto) return true;

      const numeroStr = item.numero.toString();
      const moradorNome = item.morador?.nome.toLowerCase() || '';

      return numeroStr.includes(texto) || moradorNome.includes(texto);
    });
  }

  selecionarImovel(nomeSelecionado: string) {
    const imovel = this.imoveis.find((i) => i.nome === nomeSelecionado);

    if (imovel) {
      this.imovelSelecionado = imovel.id;
      this.imovelSelecionadoNome = imovel.nome;
      this.pesquisa = '';
      this.buscarUnidade();
    }
  }

  irPara() {
    this.router.navigate(['/dashboard/cadastrar-imovel']);
  }

  irParaUnidade() {
    this.router.navigate(['/dashboard/cadastrar-unidade']);
  }
}
