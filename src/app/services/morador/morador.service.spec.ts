import { TestBed } from '@angular/core/testing';

import { MoradorService } from './morador.service';

describe('MoradorService', () => {
  let service: MoradorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoradorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
