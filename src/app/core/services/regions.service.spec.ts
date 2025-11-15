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

  it('searchRegions should return empty array for empty query', () => {
    const hits = service.searchRegions('');
    expect(hits.length).toBe(0);
  });

  it('searchRegions should return empty array for query with only whitespace', () => {
    const hits = service.searchRegions('   ');
    expect(hits.length).toBe(0);
  });

  it('searchRegions should handle exact district matches with bonus', () => {
    const hits = service.searchRegions('Aveiro');
    const exactMatchIdx = hits.findIndex(h => h.kind === 'city' && h.city === 'Aveiro');
    // Exact match should have a high score (W_CITY + EXACT_BONUS = 60 + 400 = 460)
    expect(exactMatchIdx).toBe(0);
    expect(hits[exactMatchIdx].score).toBe(460);
  });

  it('searchRegions should handle prefix matches correctly', () => {
    const hits = service.searchRegions('Fer');
    expect(hits.some(h => h.kind === 'parish' && h.parish?.startsWith('Fer'))).toBeTrue();
  });
});

