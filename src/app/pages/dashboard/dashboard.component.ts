import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeadComponent } from '../../components/head/head.component';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MoradorService } from '../../services/morador/morador.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeadComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  total = [];
  alugadas = [];
  vazias = [];
  nomeUsuario: string = '';

  constructor(private router: Router, private moradorService: MoradorService) {}

  ngOnInit(): void {
    this.moradorService.listarImoveis().subscribe({
      next: (data) => {
        const unidades = data.map((imovel: any) => imovel.Unidades).flat();

        this.alugadas = unidades.filter(
          (unidade: any) => unidade.ocupada == true
        );

        this.vazias = unidades.filter(
          (unidade: any) => unidade.ocupada == false
        );
      },
    });

    const usuario = localStorage.getItem('usuario');

    if (usuario) {
      const usuarioObj = JSON.parse(usuario);
      this.nomeUsuario = usuarioObj.nome.split(' ')[0];
    }
  }

  buttons = [
    {
      texto: 'Cadastrar Imóvel',
      icone: 'fa-solid fa-building',
      link: '/dashboard/cadastrar-imovel',
    },
    {
      texto: 'Cadastrar Unidade',
      icone: 'fa-solid fa-circle-plus',
      link: '/dashboard/cadastrar-unidade',
    },
    {
      texto: 'Cadastrar Morador',
      icone: 'fa-solid fa-user-plus',
      link: '/dashboard/cadastrar-morador',
    },
    {
      texto: 'Consultar Apartamentos',
      icone: 'fa-solid fa-magnifying-glass',
      link: '/dashboard/consultar',
    },
    {
      texto: 'Aluguéis a vencer',
      icone: 'fa-solid fa-coins',
      link: '/dashboard/alugueis-a-vencer',
    },
    {
      texto: 'Enviar boleto',
      icone: 'fa-solid fa-comments-dollar',
      link: '/dashboard/enviar-boleto',
    },
    {
      texto: 'Reajustar aluguel',
      icone: 'fa-solid fa-comments-dollar',
      link: '/dashboard/reajustar-aluguel',
    },
    {
      texto: 'Estatísticas',
      icone: 'fa-solid fa-chart-pie',
      link: '/dashboard/estatisticas',
    },
    {
      texto: 'Configurações',
      icone: 'fa-solid fa-gear',
      link: '/dashboard/configuracoes',
    },
  ];
}
