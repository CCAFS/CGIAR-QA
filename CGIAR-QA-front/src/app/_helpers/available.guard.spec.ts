import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { AvailableGuard } from './available.guard';

describe('AvailableGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AvailableGuard]
    });
  });

  it('should ...', inject([AvailableGuard], (guard: AvailableGuard) => {
    expect(guard).toBeTruthy();
  }));
});
