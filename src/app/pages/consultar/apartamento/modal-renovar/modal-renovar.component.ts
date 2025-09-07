import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BotaoLoginComponent } from '../../../../components/botao-login/botao-login.component';
import { BotaoCancelarComponent } from '../../../../components/botao-cancelar/botao-cancelar.component';
import { Router } from '@angular/router';
import { MoradorService } from '../../../../services/morador/morador.service';
import { ModalComponent } from '../../../../components/modal/modal.component';

@Component({
  selector: 'app-modal-renovar',
  imports: [
    FormsModule,
    CommonModule,
    BotaoLoginComponent,
    BotaoCancelarComponent,
    ModalComponent,
  ],
  templateUrl: './modal-renovar.component.html',
  styleUrl: './modal-renovar.component.scss',
})
export class ModalRenovarComponent {
  @Input() moradorId: number | null = null;
  @Input() unidadeId: number | null = null;
  @Output()
  fechar = new EventEmitter<void>();

  inicioContrato: Date | null = null;
  fimContrato: Date | null = null;

  mensagemModal: string = '';
  tituloModal: string = '';
  mostrarModal: boolean = false;

  constructor(private router: Router, private moradorService: MoradorService) {}

  cancelar() {
    if (this.inicioContrato != null || this.fimContrato != null) {
      this.inicioContrato = null;
      this.fimContrato = null;
    } else {
      this.fecharModal();
    }
  }

  fecharModal() {
    this.fechar.emit();
  }

  fecharModalMensagem() {
    this.mostrarModal = false;
  }

  atualizarContrato(form: NgForm) {
    if (!this.inicioContrato || !this.fimContrato) return;
    const dados = {
      moradorId: this.moradorId,
      inicioContrato: new Date(this.inicioContrato).toISOString().slice(0, 2),
      fimContrato: new Date(this.fimContrato).toISOString().slice(0, 2),
    };

    this.moradorService.atualizarUnidade(dados).subscribe({
      next: (data) => {
        this.mensagemModal = data.message;
        this.tituloModal = 'Sucesso:';
        this.mostrarModal = true;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
