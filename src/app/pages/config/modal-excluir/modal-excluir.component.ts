import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario/usuario.service';

@Component({
  selector: 'app-modal-excluir',
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-excluir.component.html',
  styleUrl: './modal-excluir.component.sass',
})
export class ModalExcluirComponent {
  alterarSenha: boolean = false;
  verSenha: boolean = false;
  verNovaSenha: boolean = false;
  verConfirmaSenha: boolean = false;

  constructor(private usuarioService: UsuarioService) {}

  toggleSenha(campo: 'senha' | 'novaSenha' | 'confirmaSenha') {
    if (campo === 'senha') {
      this.verSenha = true;
    } else if (campo == 'novaSenha') {
      this.verNovaSenha = true;
    } else if (campo == 'confirmaSenha') {
      this.verConfirmaSenha = true;
    }
  }
}
