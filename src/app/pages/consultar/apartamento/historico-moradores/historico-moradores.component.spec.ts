import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoMoradoresComponent } from './historico-moradores.component';

describe('HistoricoMoradoresComponent', () => {
  let component: HistoricoMoradoresComponent;
  let fixture: ComponentFixture<HistoricoMoradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoMoradoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoMoradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
