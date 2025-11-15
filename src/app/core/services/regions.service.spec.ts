import { TestBed } from '@angular/core/testing';
import { RegionsService } from './regions.service';

describe('RegionsService', () => {
  let service: RegionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegionsService]
    });
    service = TestBed.inject(RegionsService);
  });

  it('getRegions should return observable with data', (done) => {
    service.getRegions().subscribe(data => {
      expect(data).toBeDefined();
      expect(Object.keys(data as Record<string, unknown>).length).toBeGreaterThan(0);
      done();
    });
  });

  it('searchRegions should return a district hit for a district query', () => {
    const hits = service.searchRegions('Aveiro');
    expect(hits.some(h => h.kind === 'district' && h.district === 'Aveiro')).toBeTrue();
  });

  it('searchRegions should match city ignoring diacritics and case', () => {
    const hits = service.searchRegions('agueda');
    expect(hits.some(h => h.kind === 'city' && !!h.city && h.city.toLowerCase().includes('águeda'))).toBeTrue();
  });

  it('searchRegions should match parish names', () => {
    const hits = service.searchRegions('Fermentelos');
    expect(hits.some(h => h.kind === 'parish' && h.parish === 'Fermentelos')).toBeTrue();
  });
});

