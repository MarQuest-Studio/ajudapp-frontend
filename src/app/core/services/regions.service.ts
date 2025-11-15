import { Injectable } from '@angular/core';
import citiesData from '../../../assets/data/cities.json';
import { of } from 'rxjs';

type CityData = Record<string, string[]>;
export type HitKind = 'district' | 'city' | 'parish';
export interface RegionHit {
  district: string;
  city?: string;
  parish?: string;
  kind: HitKind;
  score: number;
}

@Injectable({
  providedIn: 'root',
})
export class RegionsService {
  public getRegions() {
    return of(citiesData);
  }

  private normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replaceAll(/[\u0300-\u036f]/g, '');
  }

  public searchRegions(query: string): RegionHit[] {
    const results: RegionHit[] = [];
    const data: Record<string, CityData[]> = citiesData as unknown as Record<string, CityData[]>;
    const normalizedQuery = this.normalizeString(query);

    if (!normalizedQuery) {
      return results;
    }

    this.searchThroughDistricts(data, normalizedQuery, results);
    this.rankResults(results, normalizedQuery);

    return results.slice(0, 100); // limit to top 100 results
  }

  private searchThroughDistricts(data: Record<string, CityData[]>, normalizedQuery: string, results: RegionHit[]) {
    for (const districtName in data) {
      const normalizedDistrict = this.normalizeString(districtName);
      if (normalizedDistrict.includes(normalizedQuery)) {
        results.push({district: districtName, kind: 'district', score: 0});
      }

      this.searchThroughDistrictCities(data, districtName, normalizedQuery, results);
    }
  }

  private searchThroughDistrictCities(data: Record<string, CityData[]>, districtName: string, normalizedQuery: string, results: RegionHit[]) {
    for (const city of data[districtName]) {
      const cityName = Object.keys(city)[0];
      const normalizedCity = this.normalizeString(cityName);
      if (normalizedCity.includes(normalizedQuery)) {
        results.push({district: districtName, city: cityName, kind: 'city', score: 0});
      }

      this.searchThroughCityParishes(data, districtName, cityName, normalizedQuery, results);
    }
  }

  private searchThroughCityParishes(data: Record<string, CityData[]>, districtName: string, cityName: string, normalizedQuery: string, results: RegionHit[]) {
    const city = data[districtName].find(currentCity => Object.keys(currentCity)[0] === cityName);
    if (!city) {
      return;
    }
    for (const parishName of city[cityName]) {
      const normalizedParish = this.normalizeString(parishName);
      if (normalizedParish.includes(normalizedQuery)) {
        results.push({district: districtName, city: cityName, parish: parishName, kind: 'parish', score: 0});
      }
    }
  }

  private computeMatchBonus(normalizedValue: string, normalizedQuery: string): number {
    const EXACT_BONUS = 400;
    const PREFIX_BONUS = 100;

    if (normalizedValue === normalizedQuery) {
      return EXACT_BONUS;
    } else if (normalizedValue.startsWith(normalizedQuery)) {
      return PREFIX_BONUS;
    }
    return 0;
  }

  private scoreHit(hit: RegionHit, normalizedQuery: string): number {
    const W_DISTRICT = 20;
    const W_CITY = 60;
    const W_PARISH = 100;

    const weights: Record<HitKind, number> = {
      district: W_DISTRICT,
      city: W_CITY,
      parish: W_PARISH,
    };

    const baseScore = weights[hit.kind];
    let matchBonus = 0;

    if (hit.kind === 'district') {
      matchBonus = this.computeMatchBonus(this.normalizeString(hit.district), normalizedQuery);
    } else if (hit.kind === 'city' && hit.city) {
      matchBonus = this.computeMatchBonus(this.normalizeString(hit.city), normalizedQuery);
    } else if (hit.kind === 'parish' && hit.parish) {
      matchBonus = this.computeMatchBonus(this.normalizeString(hit.parish), normalizedQuery);
    }

    return baseScore + matchBonus;
  }

  public rankResults(rawResults: RegionHit[], query: string) {
    const normalizedQuery = this.normalizeString(query);
    for (const hit of rawResults) {
      hit.score = this.scoreHit(hit, normalizedQuery);
    }
    // descending score; deterministic by district/city tie-break
    rawResults.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // final alphabetical tie-breakers
      if (a.district !== b.district) return a.district.localeCompare(b.district);
      if ((a.city ?? '') !== (b.city ?? '')) return (a.city ?? '').localeCompare(b.city ?? '');
      return (a.parish ?? '').localeCompare(b.parish ?? '');
    });
  }
}
