import { TestBed } from '@angular/core/testing';

import { ProjectorServiceService } from './projector-service.service';

describe('ProjectorServiceService', () => {
  let service: ProjectorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
