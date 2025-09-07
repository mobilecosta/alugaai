import { Component, Version } from '@angular/core';
import { BotaoLoginComponent } from '../../components/botao-login/botao-login.component';
import { HeadComponent } from '../../components/head/head.component';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-recover-password',
  imports: [BotaoLoginComponent, HeadComponent, CommonModule, FormsModule],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.scss',
})
export class RecoverPasswordComponent {
  verSenha: boolean = false;
  verConfirmacao: boolean = false;
  usuarioEncontrado: boolean = false;
  email: string = '';
  novaSenha: string = '';
  confirmarSenha: string = '';

  mensagemModal: string = '';
  mostrarModal: boolean = false;

  constructor(private location: Location, private authService: AuthService) {}

  toggleSenha(campo: 'senha' | 'confirmacao') {
    if (campo === 'senha') {
      this.verSenha = !this.verSenha;
    } else if (campo === 'confirmacao') {
      this.verConfirmacao = !this.verConfirmacao;
    }
  }

  buscarUsuario() {
    this.authService.buscarUsuario(this.email).subscribe({
      next: () => {
        this.usuarioEncontrado = true;
      },
      error: (err) => {
        console.error(err);
        this.mensagemModal = err.error.message;
        this.mostrarModal = true;
      },
    });
  }

  atualizarSenha() {
    const dados = {
      novaSenha: this.novaSenha,
      confirmarSenha: this.confirmarSenha,
    };
  }

  voltar() {
    this.location.back();
  }
}
