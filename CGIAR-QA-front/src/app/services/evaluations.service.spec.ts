import { TestBed } from '@angular/core/testing';

import { EvaluationsService } from './evaluations.service';

describe('EvaluationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EvaluationsService = TestBed.get(EvaluationsService);
    expect(service).toBeTruthy();
  });
});
