import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPagamentoComponent } from './registrar-pagamento.component';

describe('RegistrarPagamentoComponent', () => {
  let component: RegistrarPagamentoComponent;
  let fixture: ComponentFixture<RegistrarPagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarPagamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
