import { TestBed } from '@angular/core/testing';

import { ServicioApiBebidas } from './servicio-api-bebidas';

describe('ServicioApiBebidas', () => {
  let service: ServicioApiBebidas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioApiBebidas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
