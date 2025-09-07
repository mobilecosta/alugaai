import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlugueisAVencerComponent } from './alugueis-a-vencer.component';

describe('AlugueisAVencerComponent', () => {
  let component: AlugueisAVencerComponent;
  let fixture: ComponentFixture<AlugueisAVencerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlugueisAVencerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlugueisAVencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
