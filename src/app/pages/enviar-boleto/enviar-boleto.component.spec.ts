import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarBoletoComponent } from './enviar-boleto.component';

describe('EnviarBoletoComponent', () => {
  let component: EnviarBoletoComponent;
  let fixture: ComponentFixture<EnviarBoletoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnviarBoletoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnviarBoletoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
