import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReajustarAluguelComponent } from './reajustar-aluguel.component';

describe('ReajustarAluguelComponent', () => {
  let component: ReajustarAluguelComponent;
  let fixture: ComponentFixture<ReajustarAluguelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReajustarAluguelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReajustarAluguelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
