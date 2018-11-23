import { TestBed } from '@angular/core/testing';

import { GeoJsonService } from './geo-json.service';

describe('GeoJsonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeoJsonService = TestBed.get(GeoJsonService);
    expect(service).toBeTruthy();
  });
});
