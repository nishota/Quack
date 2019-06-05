import { TestBed } from '@angular/core/testing';

import { TweetGeneratorService } from './tweet-generator.service';

describe('TweetGeneratorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TweetGeneratorService = TestBed.get(TweetGeneratorService);
    expect(service).toBeTruthy();
  });
});
