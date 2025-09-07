import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaPagamentosComponent } from './tabela-pagamentos.component';

describe('TabelaPagamentosComponent', () => {
  let component: TabelaPagamentosComponent;
  let fixture: ComponentFixture<TabelaPagamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelaPagamentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabelaPagamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
