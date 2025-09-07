import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { BotaoLoginComponent } from '../../../components/botao-login/botao-login.component';
import { BotaoCancelarComponent } from '../../../components/botao-cancelar/botao-cancelar.component';
import { ModalComponent } from '../../../components/modal/modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-senha',
  imports: [
    FormsModule,
    CommonModule,
    BotaoLoginComponent,
    BotaoCancelarComponent,
    ModalComponent,
  ],
  templateUrl: './modal-senha.component.html',
  styleUrl: './modal-senha.component.scss',
})
export class ModalSenhaComponent {
  verSenha: boolean = false;
  verNovaSenha: boolean = false;
  verConfirmaSenha: boolean = false;

  senhaAtual: string | null = null;
  novaSenha: string | null = null;
  confirmarSenha: string | null = null;

  mensagemModal: string = '';
  tituloModal: string = '';
  mostrarModal: boolean = false;

  constructor(private usuarioService: UsuarioService, private router: Router) {}
  @Output() fechar = new EventEmitter<void>();

  usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  id = this.usuario.id;

  fecharModal() {
    this.fechar.emit();
    this.cancelar();
  }

  fecharModalMensagem() {
    if (this.mensagemModal == 'Senha atualizada com sucesso!') {
      this.router.navigate(['/dashboard']);
      this.cancelar();
    }
    this.mostrarModal = false;
  }

  toggleSenha(campo: 'senha' | 'novaSenha' | 'confirmaSenha') {
    if (campo === 'senha') {
      this.verSenha = !this.verSenha;
    } else if (campo == 'novaSenha') {
      this.verNovaSenha = !this.verNovaSenha;
    } else if (campo == 'confirmaSenha') {
      this.verConfirmaSenha = !this.verConfirmaSenha;
    }
  }

  cancelar() {
    if (
      this.senhaAtual == null &&
      this.novaSenha == null &&
      this.confirmarSenha == null
    ) {
      this.fecharModal();
    }
    this.senhaAtual = null;
    this.novaSenha = null;
    this.confirmarSenha = null;
  }

  alterarSenha(dados: any) {
    dados = {
      id: this.id,
      senhaAtual: this.senhaAtual,
      novaSenha: this.novaSenha,
      confirmarSenha: this.confirmarSenha,
    };

    this.usuarioService.alterarSenha(dados).subscribe({
      next: (data: any) => {
        this.mensagemModal = data.message;
        this.tituloModal = 'Sucesso:';
        this.mostrarModal = true;
      },
      error: (err) => {
        console.error(err);
        this.mensagemModal = err.error.message;
        this.tituloModal = 'Erro:';
        this.mostrarModal = true;
      },
    });
  }
}
