import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../../services/usuario/usuario.service';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  constructor(private usuarioService: UsuarioService, private router: Router) {}

  buttons = [
    {
      texto: 'Home',
      icone: 'fa-solid fa-home',
      link: '/dashboard',
    },
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
      texto: 'Registrar pagamento',
      icone: 'fa-solid fa-chart-pie',
      link: '/dashboard/registrar-pagamento',
    },
    {
      texto: 'Configurações',
      icone: 'fa-solid fa-gear',
      link: '/dashboard/configuracoes',
    },
    {
      texto: 'Sair',
      icone: 'fa-solid fa-circle-left',
      link: '/usuario/logout',
    },
  ];

  logout() {
    this.usuarioService.logout().subscribe({
      next: () => {
        localStorage.clear(); // limpa dados locais
        this.router.navigate(['/login']); // redireciona
      },
      error: (err) => {
        console.error('Erro ao fazer logout', err);
      },
    });
  }
}
