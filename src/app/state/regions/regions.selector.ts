import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RegionsState } from './regions.reducer';

export const selectRegionsState = createFeatureSelector<RegionsState>('regions');

export const selectDistricts = createSelector(selectRegionsState, state => state.districts);
export const selectLoading = createSelector(selectRegionsState, state => state.loading);
export const selectError = createSelector(selectRegionsState, state => state.error);