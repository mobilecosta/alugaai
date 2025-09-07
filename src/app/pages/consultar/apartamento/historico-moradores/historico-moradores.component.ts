import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-historico-moradores',
  imports: [CommonModule],
  templateUrl: './historico-moradores.component.html',
  styleUrl: './historico-moradores.component.scss',
})
export class HistoricoMoradoresComponent {
  @Input() moradoresAntigos: any = [];
}
