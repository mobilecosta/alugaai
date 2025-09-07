import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarUnidadeComponent } from './cadastrar-unidade.component';

describe('CadastrarUnidadeComponent', () => {
  let component: CadastrarUnidadeComponent;
  let fixture: ComponentFixture<CadastrarUnidadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarUnidadeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarUnidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
