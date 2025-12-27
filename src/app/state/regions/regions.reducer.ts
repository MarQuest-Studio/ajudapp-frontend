import { createReducer, on } from '@ngrx/store';
import { loadRegions, loadRegionsFailure, loadRegionsSuccess, searchRegions, searchRegionSuccess, searchRegionsFailure } from './regions.actions';
import { RegionHit } from '../../core/services/regions.service';


export type City = Record<string, string[]>;

export type District = Record<string, City[]>;

export interface RegionsState {
    districts: RegionHit[];
    loading: boolean;
    error: unknown;
}

export const initialState: RegionsState = {
  districts: [],
  loading: false,
  error: null
};

export const regionsReducer = createReducer(
  initialState,
  on(loadRegions, state => ({ ...state, loading: true })),
  on(loadRegionsSuccess, (state, { districts }) => ({ ...state, districts, loading: false })),
  on(loadRegionsFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(searchRegions, state => ({ ...state, loading: true })),
  on(searchRegionSuccess, (state, { districts }) => ({ ...state, districts, loading: false })),
  on(searchRegionsFailure, (state, { error }) => ({ ...state, error, loading: false })),
);
