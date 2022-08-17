import { TestBed } from '@angular/core/testing';

import { UadataService } from './uadata.service';

describe('UadataService', () => {
  let service: UadataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UadataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
