import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracoesApartamentoComponent } from './configuracoes-apartamento.component';

describe('ConfiguracoesApartamentoComponent', () => {
  let component: ConfiguracoesApartamentoComponent;
  let fixture: ComponentFixture<ConfiguracoesApartamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracoesApartamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracoesApartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
