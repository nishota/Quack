import { TestBed } from '@angular/core/testing';

import { InfomationService } from './infomation.service';

describe('InfomationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InfomationService = TestBed.get(InfomationService);
    expect(service).toBeTruthy();
  });
});
