import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnInit {
  @Input() mensagem = 'mensagem';
  @Input() titulo = 'titulo';
  @Output() fechar = new EventEmitter<void>();
  @Output() aberto = new EventEmitter<void>();

  ngOnInit() {
    this.aberto.emit();
  }

  fecharModal() {
    this.fechar.emit();
  }
}
