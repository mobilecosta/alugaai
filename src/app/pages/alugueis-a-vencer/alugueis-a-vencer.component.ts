import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeadComponent } from '../../components/head/head.component';
import { MoradorService } from '../../services/morador/morador.service';
import { SearchComponent } from '../../components/search/search.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Aluguel {
  imovel: string;
  Moradore: {
    nome: string;
    Unidade: {
      Imovei: {
        nomePredio: string;
      };
    };
  };
  valor: number;
  dataVencimento: string;
  foto: string | null;
  status: string;
}

interface Imovel {
  id: number;
  nomePredio: string;
}

@Component({
  selector: 'app-alugueis-a-vencer',
  imports: [
    CommonModule,
    HeadComponent,
    SearchComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './alugueis-a-vencer.component.html',
  styleUrl: './alugueis-a-vencer.component.scss',
})
export class AlugueisAVencerComponent implements OnInit {
  filter: string = '';
  dias: number | null = 5;
  pesquisa: string = '';
  imoveis: Imovel[] = [];
  alugueisFiltrados: Aluguel[] = [];
  alugueis: Aluguel[] = [];
  vencidos: Aluguel[] = [];
  imovelId: number | null = null;
  imovelSelecionado = null;
  valor: string | number = '';

  constructor(
    private moradorService: MoradorService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buscarImoveis();
  }

  voltar() {
    this.router.navigate(['/dashboard']);
  }

  cancelar() {
    this.alugueisFiltrados = [];
    this.imovelId = null;
  }

  buscarImoveis() {
    this.moradorService.listarImoveis().subscribe({
      next: (data) => {
        this.imoveis = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  pesquisar(value: string) {
    if (!value || value.trim() === '') {
      this.alugueisFiltrados = [...this.alugueisFiltrados];
      return;
    }

    this.alugueisFiltrados = this.alugueisFiltrados.filter((aluguel: any) =>
      aluguel.Moradore.nome.includes(value.toLowerCase())
    );
  }

  setFilter(valor: any) {
    this.filter = valor.toString();
    if (valor === 'Vencidos') {
      this.filtrarVencidos();
    } else if (valor == 7) {
      this.dias = 7;
      this.filtrarVencimentos();
    } else if (valor == 10) {
      this.dias = 10;
      this.filtrarVencimentos();
    }
  }

  filtrarVencidos() {
    this.alugueisFiltrados = this.vencidos;
  }

  selecionarImovel() {
    const imovel = this.imoveis.find(
      (imovel: any) => imovel.id === this.imovelId
    );

    if (imovel) {
      this.imovelId = imovel.id;
    }
  }

  filtrarVencimentos() {
    this.moradorService.listarTodosPagamentos().subscribe({
      next: (data) => {
        if (!this.dias) return;

        this.vencidos = data.filter((pagamento: any) => {
          if (!this.dias) return;
          const dataVenc = new Date(pagamento.dataVencimento);
          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0);

          const limite = new Date();
          limite.setDate(hoje.getDate() + this.dias);
          limite.setHours(23, 59, 59, 999);

          return (
            pagamento.Moradore.Unidade.Imovei.id === this.imovelId &&
            pagamento.Moradore.ativo &&
            pagamento.status === 'Pendente' &&
            dataVenc <= limite &&
            dataVenc <= hoje
          );
        });

        this.alugueisFiltrados = data.filter((pagamento: any) => {
          if (!this.dias) return;
          const dataVenc = new Date(pagamento.dataVencimento);
          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0);

          const limite = new Date();
          limite.setDate(hoje.getDate() + this.dias);
          limite.setHours(23, 59, 59, 999);

          return (
            pagamento.Moradore.Unidade.Imovei.id === this.imovelId &&
            pagamento.Moradore.ativo &&
            pagamento.status === 'Pendente' &&
            dataVenc >= hoje &&
            dataVenc <= limite
          );
        });
      },
    });
  }
}
