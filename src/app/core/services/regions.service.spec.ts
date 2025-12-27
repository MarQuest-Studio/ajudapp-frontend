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
      expect(Object.keys(data).length).toBeGreaterThan(0);
      done();
    });
  });

  it('searchRegions should return a district hit for a district query', () => {
    service.searchRegions('aveiro').subscribe(hits => {
      expect(hits.some(h => h.kind === 'district' && h.district === 'Aveiro')).toBeTrue();
    });
  });

  it('searchRegions should match city ignoring diacritics and case', () => {
    service.searchRegions('agueda').subscribe(hits => {
      expect(hits.some(h => h.kind === 'city' && !!h.city && h.city.toLowerCase().includes('águeda'))).toBeTrue();
    });
  });

  it('searchRegions should match parish names', () => {
    service.searchRegions('Fermentelos').subscribe(hits => {
      expect(hits.some(h => h.kind === 'parish' && h.parish === 'Fermentelos')).toBeTrue();
    });
  });

  it('searchRegions should return all districts for empty query', () => {
    service.searchRegions('').subscribe(hits => {
      expect(hits.length).toBeGreaterThan(0);
    });
  });

  it('searchRegions should return empty array for query with only whitespace', () => {
    service.searchRegions('   ').subscribe(hits => {
      expect(hits.length).toBe(0);
    });
  });

  it('searchRegions should handle exact district matches with bonus', () => {
    service.searchRegions('Aveiro').subscribe(hits => {
      const exactMatchIdx = hits.findIndex(h => h.kind === 'city' && h.city === 'Aveiro');
      // Exact match should have a high score (W_CITY + EXACT_BONUS = 60 + 400 = 460)
      expect(exactMatchIdx).toBe(0);
      expect(hits[exactMatchIdx].score).toBe(460);
    });
  });
  it('searchRegions should handle prefix matches correctly', () => {
    service.searchRegions('Fer').subscribe(hits => {
      expect(hits.some(h => h.kind === 'parish' && h.parish?.startsWith('Fer'))).toBeTrue();
    });
  });
});

