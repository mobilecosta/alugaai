import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarMoradorComponent } from './cadastrar-morador.component';

describe('CadastrarMoradorComponent', () => {
  let component: CadastrarMoradorComponent;
  let fixture: ComponentFixture<CadastrarMoradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarMoradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarMoradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
